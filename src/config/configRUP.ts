export const daerahList = [
    "D197"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "RUP-PaketPenyedia-Terumumkan", 
    "RUP-PaketSwakelola-Terumumkan", 
    "RUP-StrukturAnggaranPD", 
    "RUP-MasterSatker", 
    "RUP-ProgramMaster", 
    "RUP-KegiatanMaster", 
    "RUP-SubKegiatanMaster", 
    "RUP-PaketAnggaranPenyedia"
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "D197": { // PROV. KALIMANTAN BARAT
        "RUP-PaketPenyedia-Terumumkan": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-PaketSwakelola-Terumumkan": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-StrukturAnggaranPD": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-MasterSatker": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-ProgramMaster": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-KegiatanMaster": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-SubKegiatanMaster": { apiKey: "your-api-key", kode: "your-code" },
        "RUP-PaketAnggaranPenyedia": { apiKey: "your-api-key", kode: "your-code" }
    }
};