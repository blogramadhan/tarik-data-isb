import { mkdirSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import * as duckdb from "duckdb";
import { daerahList, jenisDataTypes, configMap, type Daerah, type JenisData } from "./config/configKATALOG";

const tahunList = [2023, 2024, 2025];

// Membuat URL API ISB berdasarkan parameter
function buildURL(daerah: Daerah, jenis: JenisData, params: { tahun?: number, kodeKomoditas?: string, kodePenyedia?: string, kdKlpd?: string }) {
    const baseUrl = "https://isb.lkpp.go.id/isb-2/api";

    if (!configMap[daerah]) throw new Error(`Daerah tidak dikenal: ${daerah}`);
    const config = configMap[daerah][jenis];
    if (!config) throw new Error(`Jenis data tidak dikenal untuk daerah ${daerah}: ${jenis}`);

    let parameter = "";
    if (jenis === "Ecat-KomoditasDetail") {
        if (!params.kodeKomoditas) throw new Error("Kode komoditas diperlukan untuk detail komoditas");
        parameter = `4/parameter/${params.kodeKomoditas}`;
    } else if (jenis === "Ecat-PenyediaDetail") {
        if (!params.kodePenyedia) throw new Error("Kode penyedia diperlukan untuk detail penyedia");
        parameter = `4/parameter/${params.kodePenyedia}`;
    } else if (jenis === "Ecat-InstansiSatker") {
        if (!params.kdKlpd) throw new Error("Kode KLPD diperlukan untuk data satker");
        parameter = `12/parameter/${params.kdKlpd}`;
    } else {
        if (!params.tahun) throw new Error("Tahun diperlukan untuk data paket");
        parameter = `4:12/parameter/${params.tahun}:${daerah}`;
    }

    return `${baseUrl}/${config.apiKey}/json/${config.kode}/${jenis}/tipe/${parameter}`;
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

    const dataDir = "data/katalog";
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

    const dataDir = "data/katalog";
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
                TO '${excelFile}' (FORMAT 'xlsx');
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
    console.log("🚀 Memulai proses download data KATALOG");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

    let totalDataFetched = 0; // Variabel untuk menghitung total data yang berhasil diambil
    let totalDataFailed = 0; // Variabel untuk menghitung total data yang gagal diambil
    let totalDataSkipped = 0; // Variabel untuk menghitung total data yang dilewatkan

    for (const daerah of daerahList) {
        for (const tahun of tahunList) {
            // Cek apakah semua file sudah ada
            const allFilesExist = jenisDataTypes.every(jenis => {
                const jsonPath = `data/katalog/${daerah}/${jenis}/${tahun}/data.json`;
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
                const url = buildURL(daerah as Daerah, "Ecat-PaketEPurchasing", { tahun });
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
                const response = await res.json() as { data?: any[] } | any[];

                // Pastikan data berupa array
                const data = Array.isArray(response) ? response : response.data || [];
                if (!data.length) {
                    console.log(`⚠️ Tidak ada data untuk ${daerah}/Ecat-PaketEPurchasing/${tahun}`);
                    continue;
                }

                totalDataFetched++; // Tambahkan jumlah data yang berhasil diambil

                // Simpan data paket ke file JSON
                const jsonPath = `data/katalog/${daerah}/Ecat-PaketEPurchasing/${tahun}/data.json`;
                mkdirSync(dirname(jsonPath), { recursive: true });
                writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                console.log(`✅ Data paket disimpan: ${jsonPath}`);

                // Kumpulkan kode-kode unik
                const uniqueKodeKomoditas = new Set<string>();
                const uniqueKodePenyedia = new Set<string>();
                const uniqueKodeKlpd = new Set<string>();

                data.forEach(item => {
                    if (item.kd_komoditas) uniqueKodeKomoditas.add(item.kd_komoditas);
                    if (item.kd_penyedia) uniqueKodePenyedia.add(item.kd_penyedia);
                    if (item.kd_klpd) uniqueKodeKlpd.add(item.kd_klpd);
                });

                // Ambil dan simpan detail komoditas
                const komoditasPath = `data/katalog/${daerah}/Ecat-KomoditasDetail/${tahun}/data.json`;
                const komoditasDetails: any[] = [];

                for (const kodeKomoditas of uniqueKodeKomoditas) {
                    try {
                        const url = buildURL(daerah as Daerah, "Ecat-KomoditasDetail", { kodeKomoditas });
                        const res = await fetch(url);

                        if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            komoditasDetails.push(...data);
                        }
                    } catch (err: any) {
                        console.error(`❌ Gagal mengambil detail komoditas ${kodeKomoditas}:`, err.message);
                    }
                }

                mkdirSync(dirname(komoditasPath), { recursive: true });
                writeFileSync(komoditasPath, JSON.stringify(komoditasDetails, null, 2));
                console.log(`✅ Detail komoditas disimpan: ${komoditasPath}`);

                // Ambil dan simpan detail penyedia
                const penyediaPath = `data/katalog/${daerah}/Ecat-PenyediaDetail/${tahun}/data.json`;
                const penyediaDetails: any[] = [];

                for (const kodePenyedia of uniqueKodePenyedia) {
                    try {
                        const url = buildURL(daerah as Daerah, "Ecat-PenyediaDetail", { kodePenyedia });
                        const res = await fetch(url);
                        if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            penyediaDetails.push(...data);
                        }
                    } catch (err: any) {
                        console.error(`❌ Gagal mengambil detail penyedia ${kodePenyedia}:`, err.message);
                    }
                }

                mkdirSync(dirname(penyediaPath), { recursive: true });
                writeFileSync(penyediaPath, JSON.stringify(penyediaDetails, null, 2));
                console.log(`✅ Detail penyedia disimpan: ${penyediaPath}`);

                // Ambil dan simpan detail satker
                const satkerPath = `data/katalog/${daerah}/Ecat-InstansiSatker/${tahun}/data.json`;
                const satkerDetails: any[] = [];

                for (const kdKlpd of uniqueKodeKlpd) {
                    try {
                        const url = buildURL(daerah as Daerah, "Ecat-InstansiSatker", { kdKlpd });
                        const res = await fetch(url);
                        if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            satkerDetails.push(...data);
                        }
                    } catch (err: any) {
                        console.error(`❌ Gagal mengambil detail satker ${kdKlpd}:`, err.message);
                    }
                }

                mkdirSync(dirname(satkerPath), { recursive: true });
                writeFileSync(satkerPath, JSON.stringify(satkerDetails, null, 2));
                console.log(`✅ Detail satker disimpan: ${satkerPath}`);

            } catch (err: any) {
                totalDataFailed++; // Tambahkan jumlah data yang gagal diambil
                console.error(`❌ Gagal mengambil data untuk ${daerah} tahun ${tahun}:`, err.message);
            }
        }
    }
    
    // Konversi semua file JSON ke Parquet dan Excel
    await convertJsonToParquet();
    await convertJsonToExcel();

    console.log(`🎉 Download data KATALOG selesai! Berhasil: ${totalDataFetched}, Gagal: ${totalDataFailed}, Dilewati: ${totalDataSkipped}`);
}

// Menjalankan fungsi utama
fetchAndSave().catch(console.error);