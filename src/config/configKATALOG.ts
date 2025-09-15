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
        "Ecat-PaketEPurchasing": { apiKey: "eeb14303-22d7-4193-8793-60bbfdb468fe", kode: "3330" },
        "Ecat-KomoditasDetail": { apiKey: "af9a6323-71f0-4ddf-843f-ba7052637b28", kode: "3336" },
        "Ecat-PenyediaDetail": { apiKey: "93c2af98-02e3-483c-b597-e0a790004e90", kode: "3328" },
        "Ecat-InstansiSatker": { apiKey: "a20ef982-c41b-49bf-8c07-cc710c465f47", kode: "3329" }
    }
};