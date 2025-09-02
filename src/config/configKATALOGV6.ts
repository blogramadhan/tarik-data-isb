export const daerahList = [
    "D197"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "Ecat-PaketEPurchasingV6"
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "D197": { // PROV. KALIMANTAN BARAT
        "Ecat-PaketEPurchasingV6": { apiKey: "your-api-key", kode: "your-code" }
    }
};