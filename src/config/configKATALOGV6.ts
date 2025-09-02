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
        "Ecat-PaketEPurchasingV6": { apiKey: "972895ec-519b-40a6-a612-0f7dc4f7191a", kode: "30960" }
    }
};