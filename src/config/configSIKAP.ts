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
        "SIKaP-PenilaianKinerjaPenyedia-Tender": { apiKey: "0ad35ce0-2237-48c3-918c-66e84668db58", kode: "7045" },
        "SiKAP-PenilaianKinerjaPenyedia-NonTender": { apiKey: "4d59aa07-998c-4803-93a6-ba349fa68750", kode: "7047" }
    }
};