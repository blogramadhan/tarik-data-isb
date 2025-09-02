export const daerahList = [
    "97"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "SPSE-TenderPengumuman", 
    "SPSE-TenderSelesai", 
    "SPSE-TenderSelesaiNilai", 
    "SPSE-TenderEkontrak-SPPBJ",
    "SPSE-TenderEkontrak-Kontrak", 
    "SPSE-TenderEkontrak-SPMKSPP", 
    "SPSE-TenderEkontrak-BAPBAST",
    "SPSE-NonTenderPengumuman",
    "SPSE-NonTenderSelesai",
    "SPSE-NonTenderEkontrak-SPPBJ",
    "SPSE-NonTenderEkontrak-Kontrak",
    "SPSE-NonTenderEkontrak-SPMKSPP",
    "SPSE-NonTenderEkontrak-BAPBAST",
    "SPSE-PencatatanNonTender",
    "SPSE-PencatatanNonTenderRealisasi",
    "SPSE-PencatatanSwakelola",
    "SPSE-PencatatanSwakelolaRealisasi",
    "SPSE-PesertaTender",
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "97": { // PROV. KALIMANTAN BARAT
        "SPSE-TenderPengumuman": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderSelesai": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderSelesaiNilai": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderEkontrak-SPPBJ": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderEkontrak-Kontrak": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderEkontrak-SPMKSPP": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-TenderEkontrak-BAPBAST": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderPengumuman": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderSelesai": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderEkontrak-SPPBJ": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderEkontrak-Kontrak": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderEkontrak-SPMKSPP": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-NonTenderEkontrak-BAPBAST": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-PencatatanNonTender": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-PencatatanNonTenderRealisasi": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-PencatatanSwakelola": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-PencatatanSwakelolaRealisasi": { apiKey: "your-api-key", kode: "your-code" },
        "SPSE-PesertaTender": { apiKey: "your-api-key", kode: "your-code" }
    }
};