export const daerahList = [
    "D197"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "Ecat-PaketEPurchasing",
    "Ecat-KomoditasDetail",
    "Ecat-PenyediaDetail",
    "Ecat-InstansiSatker"
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "D197": { // PROV. KALIMANTAN BARAT
        "Ecat-PaketEPurchasing": { apiKey: "your-api-key", kode: "your-code" },
        "Ecat-KomoditasDetail": { apiKey: "your-api-key", kode: "your-code" },
        "Ecat-PenyediaDetail": { apiKey: "your-api-key", kode: "your-code" },
        "Ecat-InstansiSatker": { apiKey: "your-api-key", kode: "your-code" }
    }
};