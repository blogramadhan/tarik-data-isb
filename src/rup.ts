import { mkdirSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import * as duckdb from "duckdb";
import { daerahList, jenisDataTypes, configMap, type Daerah, type JenisData } from "./config/configRUP";

const tahunList = [2023, 2024, 2025];
const tahun31Maret = 2025;

// Membuat URL API ISB berdasarkan parameter
function buildURL(daerah: Daerah, jenis: JenisData, tahun: number) {
    const baseUrl = "https://isb.lkpp.go.id/isb-2/api";

    if (!configMap[daerah]) throw new Error(`Daerah tidak dikenal: ${daerah}`);
    const config = configMap[daerah][jenis];
    if (!config) throw new Error(`Jenis data tidak dikenal untuk daerah ${daerah}: ${jenis}`);

    if (jenis === "RUP-MasterSatker") {
        return `${baseUrl}/${config.apiKey}/json/${config.kode}/${jenis}/tipe/12:12/parameter/${daerah}:${tahun}`;
    }
    return `${baseUrl}/${config.apiKey}/json/${config.kode}/${jenis}/tipe/4:12/parameter/${tahun}:${daerah}`;
}

// Mencari file JSON secara rekursif
function findJsonFiles(dir: string): string[] {
    let results: string[] = [];
    const items = readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = join(dir, item.name);
        if (item.isDirectory()) {
            results = results.concat(findJsonFiles(fullPath));
        } else if (item.name.endsWith('.json')) {
            results.push(fullPath);
        }
    }

    return results;
}

// Konversi file JSON ke format Parquet
async function convertJsonToParquet() {
    console.log("🔄 Memulai konversi JSON ke Parquet...")

    const dataDir = "data/rup";
    if (!existsSync(dataDir)) {
        console.log("⚠️ Direktori data tidak ditemukan");
        return;
    }

    // Cari semua file JSON
    const jsonFiles = findJsonFiles(dataDir);
    console.log(`🔍 Ditemukan ${jsonFiles.length} file JSON untuk dikonversi`);

    const db = new duckdb.Database(':memory:');
    const conn = db.connect();

    for (const jsonFile of jsonFiles) {
        try {
            const parquetFile = jsonFile.replace('.json', '.parquet');
            mkdirSync(dirname(parquetFile), { recursive: true });

            conn.exec(`
                COPY (SELECT * FROM read_json('${jsonFile}', auto_detect => true)) 
                TO '${parquetFile}' (FORMAT 'parquet');
            `);

            console.log(`✅ Konversi berhasil: ${jsonFile} -> ${parquetFile}`);
        } catch (err: any) {
            console.error(`❌ Gagal mengkonversi ${jsonFile}: ${err.message}`)
        }
    }

    conn.close();
    db.close();
    console.log("✅ Konversi JSON ke Parquet selesai")
}

// Konversi file JSON ke format Excel
async function convertJsonToExcel() {
    console.log("🔄 Memulai konversi JSON ke Excel...");

    const dataDir = "data/rup";
    if (!existsSync(dataDir)) {
        console.log("⚠️ Direktori data tidak ditemukan");
        return;
    }

    // Cari semua file JSON
    const jsonFiles = findJsonFiles(dataDir);
    console.log(`🔍 Ditemukan ${jsonFiles.length} file JSON untuk dikonversi ke Excel`);

    const db = new duckdb.Database(':memory:');
    const conn = db.connect();

    for (const jsonFile of jsonFiles) {
        try {
            const excelFile = jsonFile.replace('.json', '.xlsx');
            mkdirSync(dirname(excelFile), { recursive: true });

            // Gunakan DuckDB untuk membaca JSON dan mengekspor ke Excel
            conn.exec(`
                INSTALL 'excel';
                LOAD 'excel';
                COPY (SELECT * FROM read_json('${jsonFile}', auto_detect => true)) 
                TO '${excelFile}' (FORMAT 'xlsx', HEADER true);
            `);

            console.log(`✅ Konversi berhasil: ${jsonFile} -> ${excelFile}`);
        } catch (err: any) {
            console.error(`❌ Gagal mengkonversi ${jsonFile} ke Excel: ${err.message}`)
        }
    }

    conn.close();
    db.close();
    console.log("✅ Konversi JSON ke Excel selesai")
}

// Mengambil data dari API ISB dan menyimpan ke file JSON, Parquet, atau Excel
async function fetchAndSave() {
    console.log("🚀 Memulai proses download data RUP");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

    let totalDataFetched = 0; // Variabel untuk menghitung total data yang berhasil diambil
    let totalDataFailed = 0; // Variabel untuk menghitung total data yang gagal diambil
    let totalDataSkipped = 0; // Variabel untuk menghitung total data yang dilewatkan

    for (const daerah of daerahList) {
        for (const jenis of jenisDataTypes) {
            for (const tahun of tahunList) {
                // Cek apakah semua file sudah ada
                const allFilesExist = jenisDataTypes.every(jenis => {
                    const jsonPath = `data/rup/${daerah}/${jenis}/${tahun}/data.json`;
                    return existsSync(jsonPath);
                });

                // Skip jika:
                // 1. Semua file sudah ada
                // 2. Bukan tahun berjalan
                // 3. Bukan tahun sebelumnya (jika sudah melewati Februari tahun berjalan)
                if (allFilesExist && !(tahun === currentYear || (tahun === currentYear - 1 && currentMonth <= 2 ))) {
                    console.log(`⏭️ Melewati data ${jenis} ${tahun} untuk ${daerah} (sudah lengkap)`);
                    totalDataSkipped++; // Tambahkan jumlah data yang dilewati
                    continue;
                }

                console.log(`🔄 Mengambil ${jenis} ${tahun} untuk ${daerah} ...`);
                try {
                    // Ambil data dari API ISB
                    const url = buildURL(daerah as Daerah, jenis as JenisData, tahun);
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
                    const response = await res.json() as { data?: any[] } | any[];

                    // Pastikan data berupa array
                    const data = Array.isArray(response) ? response : response.data || [];
                    if (!data.length) {
                        console.log(`⚠️ Tidak ada data untuk ${daerah}/${jenis}/${tahun}`);
                        continue;
                    }

                    totalDataFetched++; // Tambahkan jumlah data yang berhasil diambil

                    // Buat folder penyimpanan jika belum ada
                    const folder = `data/rup/${daerah}/${jenis}/${tahun}`;
                    mkdirSync(folder, { recursive: true });

                    // Simpan data khusus 31 Maret jika sesuai kriteria
                    const today = new Date();
                    if (today.getDate() === 31 && today.getMonth() === 2 && today.getFullYear() === tahun31Maret &&
                        ["RUP-PaketPenyedia-Terumumkan", 
                        "RUP-PaketSwakelola-Terumumkan", 
                        "RUP-StrukturAnggaranPD"].includes(jenis)) {
                        writeFileSync(join(folder, "data31.json"), JSON.stringify(data, null, 2));
                        console.log(`✅ JSON 31 Maret disimpan: ${join(folder, "data31.json")}`);
                    }

                    // Simpan data reguler
                    writeFileSync(join(folder, "data.json"), JSON.stringify(data, null, 2));
                    console.log(`✅ JSON disimpan: ${join(folder, "data.json")}`);
                } catch (err: any) {
                    totalDataFailed++; // Tambahkan jumlah data yang gagal diambil
                    console.error(`❌ Gagal: ${daerah}/${jenis}/${tahun} =>`, err.message);
                }
            }
        }
    }
    
    // Konversi semua file JSON ke Parquet dan Excel
    await convertJsonToParquet();
    await convertJsonToExcel();

    console.log(`🎉 Download data RUP selesai! Berhasil: ${totalDataFetched}, Gagal: ${totalDataFailed}, Dilewati: ${totalDataSkipped}`);
}

// Menjalankan fungsi utama
fetchAndSave().catch(console.error);