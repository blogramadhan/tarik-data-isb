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
        "Bela-TokoDaringRealisasi": { apiKey: "4cf1694f-5bd9-4560-bc29-dbcab4ba98d4", kode: "3352" }
    }
};