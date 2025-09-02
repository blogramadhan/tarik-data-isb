# 📊 Tarik Data ISB (Inaproc Service Bus)

Aplikasi Bun.js/TypeScript untuk mengunduh dan memproses data pengadaan barang/jasa dari sistem ISB (Inaproc Service Bus) LKPP secara otomatis.

**Pembuat:** Kurnia Ramadhan, ST., M.Eng  
**Instansi:** LPSE PROV KALIMANTAN BARAT

## 🎯 Deskripsi

**Tarik Data ISB** adalah tools yang dirancang untuk mempermudah pengunduhan data pengadaan barang dan jasa dari berbagai sistem LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah) Indonesia. Tools ini mendukung pengunduhan data dari 6 sistem utama:

- **RUP** (Rencana Umum Pengadaan)
- **DARING** (Data Online Pengadaan)
- **KATALOG** (E-Catalogue)
- **KATALOGV6** (E-Catalogue Versi 6)
- **SPSE** (Sistem Pengadaan Secara Elektronik)
- **SIKAP** (Sistem Informasi Kinerja Penyedia)

## ✨ Fitur Utama

### 🔄 Multi-Format Export
- **JSON** - Format data mentah untuk pemrosesan lebih lanjut
- **Parquet** - Format kolumnar yang efisien untuk analisis big data
- **Excel (XLSX)** - Format spreadsheet untuk analisis manual

### 🌍 Multi-Region Support
Saat ini mendukung data dari **Provinsi Kalimantan Barat (D197)** dengan kemampuan ekspansi ke daerah lain.

### 📅 Multi-Year Data
- Data historis: 2023, 2024, 2025
- Update otomatis untuk data tahun berjalan
- Snapshot khusus 31 Maret untuk data tertentu

### 🚀 Optimisasi Performa
- Skip otomatis untuk data yang sudah ada
- Konversi batch menggunakan DuckDB
- Memory-efficient processing

## 🛠️ Teknologi

- **Runtime**: Bun (JavaScript runtime yang cepat)
- **Language**: TypeScript
- **Database**: DuckDB (untuk konversi format)
- **API**: ISB (Inaproc Service Bus) LKPP REST API

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.0+
- TypeScript v5+
- Koneksi internet untuk akses API ISB (Inaproc Service Bus)

## 🚀 Instalasi

```bash
# Clone repository
git clone <repository-url>
cd tarik-data-isb

# Install dependencies menggunakan Bun
bun install
```

## 📖 Penggunaan

### RUP (Rencana Umum Pengadaan)

```bash
# Jalankan pengunduhan data RUP
bun run rup
```

**Data yang diunduh:**
- Paket Penyedia Terumumkan
- Paket Swakelola Terumumkan  
- Struktur Anggaran PD
- Master Satker
- Program Master
- Kegiatan Master
- Sub Kegiatan Master
- Paket Anggaran Penyedia

### DARING (Data Online Pengadaan)

```bash
# Jalankan script daring
bun run daring
```

**Data yang diunduh:**
- Data tender dan pengadaan online
- Informasi lelang elektronik

### KATALOG (E-Catalogue)

```bash
# Jalankan script katalog
bun run katalog
```

**Data yang diunduh:**
- Data komoditas e-catalogue
- Informasi penyedia
- Detail produk dan harga

### KATALOGV6 (E-Catalogue Versi 6)

```bash
# Jalankan script katalog versi 6
bun run katalogv6
```

**Data yang diunduh:**
- Data komoditas e-catalogue versi terbaru
- Informasi penyedia versi 6
- Detail produk dan harga terkini

### SPSE (Sistem Pengadaan Secara Elektronik)

```bash
# Jalankan script SPSE
bun run spse
```

**Data yang diunduh:**
- Data pengadaan elektronik
- Tender dan kontrak

### SIKAP (Sistem Informasi Kinerja Penyedia)

```bash
# Jalankan script SIKAP
bun run sikap
```

**Data yang diunduh:**
- Kinerja penyedia barang/jasa
- Rating dan evaluasi penyedia

## 📁 Struktur Output

```
data/
├── rup/
│   └── D197/
│       ├── RUP-PaketPenyedia-Terumumkan/
│       │   ├── 2023/
│       │   │   ├── data.json
│       │   │   ├── data.parquet
│       │   │   └── data.xlsx
│       │   ├── 2024/
│       │   └── 2025/
│       │       └── data31.json (snapshot 31 Maret)
│       └── [jenis-data-lainnya]/
├── daring/
├── katalog/
├── katalogv6/
├── spse/
└── sikap/
```

## ⚙️ Konfigurasi

Setiap modul memiliki file konfigurasi terpisah di folder `src/config/`:

- `configRUP.ts` - Konfigurasi API untuk data RUP
- `configDARING.ts` - Konfigurasi API untuk data DARING
- `configKATALOG.ts` - Konfigurasi API untuk data Katalog
- `configKATALOGV6.ts` - Konfigurasi API untuk data Katalog V6
- `configSPSE.ts` - Konfigurasi API untuk data SPSE
- `configSIKAP.ts` - Konfigurasi API untuk data SIKAP

### Menambah Daerah Baru

1. Dapatkan kode daerah dan API key dari ISB (Inaproc Service Bus) LKPP
2. Tambahkan ke array `daerahList` di file konfigurasi
3. Tambahkan mapping API key dan kode di `configMap`

Contoh:
```typescript
export const daerahList = [
    "D197", // Kalimantan Barat
    "D001"  // Daerah baru
] as const;

export const configMap = {
    "D197": { /* existing config */ },
    "D001": {
        "RUP-PaketPenyedia-Terumumkan": { 
            apiKey: "your-api-key", 
            kode: "your-code" 
        },
        // ... konfigurasi lainnya
    }
};
```

## 🔍 Format Data

### JSON
Data mentah dari API ISB dalam format JSON standar, cocok untuk pemrosesan programatik.

### Parquet
Format kolumnar yang dioptimalkan untuk:
- Analisis big data
- Kompresi efisien
- Query performance tinggi
- Kompatibilitas dengan tools seperti Apache Spark, Pandas

### Excel (XLSX)
Format spreadsheet untuk:
- Analisis manual
- Reporting
- Sharing dengan stakeholder non-teknis

## 🚨 Fitur Khusus

### Snapshot 31 Maret
Untuk data RUP tertentu, aplikasi akan menyimpan snapshot khusus pada tanggal 31 Maret dengan nama file `data31.json`. Ini berguna untuk analisis deadline pengumuman RUP.

### Smart Caching
- Data yang sudah diunduh akan di-skip secara otomatis
- Update otomatis untuk data tahun berjalan
- Update data tahun sebelumnya hanya sampai Februari

### Error Handling
- Retry mechanism untuk koneksi yang gagal
- Logging detail untuk debugging
- Graceful handling untuk data kosong

## 📊 Statistik Pengunduhan

Setiap proses pengunduhan akan menampilkan statistik:
- ✅ **Berhasil**: Jumlah data yang berhasil diunduh
- ❌ **Gagal**: Jumlah data yang gagal diunduh
- ⏭️ **Dilewati**: Jumlah data yang di-skip (sudah ada)

## 🛡️ Troubleshooting

### Error: "Daerah tidak dikenal"
- Pastikan kode daerah sudah ditambahkan ke `daerahList`
- Periksa konfigurasi di file config yang sesuai

### Error: "Gagal fetch"
- Periksa koneksi internet
- Verifikasi API key masih valid
- Cek status server ISB (Inaproc Service Bus) LKPP

### File tidak ter-generate
- Pastikan permission write ke folder `data/`
- Periksa space disk yang tersedia
- Cek log error untuk detail masalah

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 Changelog

### v1.0.0
- ✅ Support untuk 6 sistem ISB (RUP, DARING, KATALOG, KATALOGV6, SPSE, SIKAP)
- ✅ Export ke 3 format (JSON, Parquet, Excel)
- ✅ Smart caching dan update otomatis
- ✅ Multi-year data support
- ✅ Snapshot khusus 31 Maret

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 📞 Dukungan

Untuk pertanyaan, bug report, atau feature request:
- Buka issue di GitHub repository
- Hubungi maintainer project

## ⚠️ Disclaimer

Tools ini dibuat untuk mempermudah akses data publik ISB (Inaproc Service Bus) LKPP. Pastikan penggunaan sesuai dengan ketentuan dan kebijakan LKPP. Pengguna bertanggung jawab atas penggunaan data yang diunduh.

---

**Happy Data Mining! 🎉**