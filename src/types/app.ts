// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Kursverwaltung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    kurs_name?: string;
    kurs_beschreibung?: string;
    kurs_zeitplan?: string; // Format: YYYY-MM-DD oder ISO String
    kurs_ort?: string;
  };
}

export interface Kursleiterzuordnung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    kursleiter_vorname?: string;
    kursleiter_nachname?: string;
    kursleiter_kontakt?: string;
    zugewiesener_kurs?: string; // applookup -> URL zu 'Kursverwaltung' Record
  };
}

export interface Teilnehmeranmeldung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    teilnehmer_vorname?: string;
    teilnehmer_nachname?: string;
    teilnehmer_email?: string;
    angemeldete_kurse?: string;
  };
}

export const APP_IDS = {
  KURSVERWALTUNG: '67f66996376fb033d6c730f0',
  KURSLEITERZUORDNUNG: '67f6699b9b343bea8b25ffe5',
  TEILNEHMERANMELDUNG: '67f6699bf4670ca0848ed188',
} as const;

// Helper Types for creating new records
export type CreateKursverwaltung = Kursverwaltung['fields'];
export type CreateKursleiterzuordnung = Kursleiterzuordnung['fields'];
export type CreateTeilnehmeranmeldung = Teilnehmeranmeldung['fields'];