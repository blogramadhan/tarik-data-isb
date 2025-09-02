export const daerahList = [
    "D197"
] as const;

export type Daerah = (typeof daerahList)[number];

export const jenisDataTypes = [
    "SIKaP-PenilaianKinerjaPenyedia-Tender",
    "SiKAP-PenilaianKinerjaPenyedia-NonTender"
] as const;

export type JenisData = (typeof jenisDataTypes)[number];

export const configMap: Partial<Record<Daerah, Record<string, { apiKey: string, kode: string }>>> = {
    "D197": { // PROV. KALIMANTAN BARAT
        "SIKaP-PenilaianKinerjaPenyedia-Tender": { apiKey: "your-api-key", kode: "your-code" },
        "SiKAP-PenilaianKinerjaPenyedia-NonTender": { apiKey: "your-api-key", kode: "your-code" }
    }
};