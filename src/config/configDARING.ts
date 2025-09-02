export const daerahList = [
    "D197"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "Bela-TokoDaringRealisasi"
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "D197": { // PROV. KALIMANTAN BARAT
        "Bela-TokoDaringRealisasi": { apiKey: "your-api-key", kode: "your-code" }
    }
};