/* ------------------------------------------------------------------ */
/*  Typen für alle Lerninhalte (JSON in src/data) und den Fortschritt  */
/* ------------------------------------------------------------------ */

export type Difficulty = 1 | 2 | 3; // 1 = leicht, 2 = mittel, 3 = schwer

/** Eine Multiple-Choice-Frage (Quiz, Rechenaufgaben, Simulation). */
export interface Question {
  id: string;
  /** Wird beim Laden aus dem Dateinamen bzw. "topic" der JSON-Datei gesetzt. */
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  /** Index (ab 0) der richtigen Antwort in `options`. */
  correctAnswer: number;
  /** Warum ist die richtige Antwort richtig? (2–4 Sätze, einfach erklärt) */
  explanation: string;
  /** Gleich lang wie `options`. An der Stelle der richtigen Antwort steht null. */
  wrongExplanations: (string | null)[];
  /** Praxis-Tipp oder Beispiel aus dem Makler-Alltag. */
  practiceTip: string;
  /** Nur Rechenaufgaben: Rechenweg Schritt für Schritt. */
  steps?: string[];
  /** Nur Simulation: Ausgangslage der Station. */
  scenario?: string;
  /** Optional: Stand rechtlicher Zahlen, z. B. "Stand 2025". */
  stand?: string;
  /** Optional: Unterkategorie (z. B. bei Rechenaufgaben). */
  category?: string;
  /** true = Antworten nicht mischen (z. B. bei "Alle genannten"). */
  fixedOrder?: boolean;
}

export interface QuestionFile {
  topic: string;
  /** Stand der rechtlichen Angaben in dieser Datei. */
  stand?: string;
  hinweis?: string;
  questions: Omit<Question, "topic">[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: TopicColor;
}

export type TopicColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet"
  | "teal"
  | "orange";

export interface Flashcard {
  id: string;
  topic: string;
  term: string;
  definition: string;
  example?: string;
}

export interface Level {
  level: number;
  xp: number;
  title: string;
}

/* --------------------------- Baujahr-Raten -------------------------- */

export interface EpochFeature {
  text: string;
  /** Kurze Erklärung, warum das ein Erkennungsmerkmal ist. */
  detail?: string;
  /** Position des Marker-Punktes in der SVG (viewBox 400 x 260). */
  x: number;
  y: number;
}

export interface EpochPhoto {
  src: string; // z. B. "/images/epochs/gruenderzeit.jpg"
  alt: string;
  author: string;
  license: string; // z. B. "CC BY-SA 4.0"
  sourceUrl: string; // Link zur Wikimedia-Commons-Seite
}

export interface Epoch {
  id: string;
  name: string;
  zeitraum: string;
  /** Ein Satz: woran erkennt man die Epoche sofort? */
  signature: string;
  /** Hinweise, die man vor dem Raten aufdecken kann. */
  hinweise: string[];
  merkmale: EpochFeature[];
  /** Worauf beim Verkauf/Kauf zu achten ist. */
  verkauf: { thema: string; text: string }[];
  /** Verwechslungen: id einer anderen Epoche → warum sie es nicht ist. */
  verwechslung: Record<string, string>;
  /** Optional: eigenes Foto statt SVG (mit Lizenzangabe). */
  photo?: EpochPhoto | null;
}

/* ----------------------------- Kaufprozess -------------------------- */

export interface KaufStep {
  nr: number;
  titel: string;
  icon: string;
  kurz: string;
  details: string[];
  tipp: string;
  /** Verweis auf ein Kaufprozess-Modul, z. B. "rechner" oder "checkliste". */
  link?: "rechner" | "checkliste" | "unterlagen";
}

export interface ChecklistGroup {
  id: string;
  titel: string;
  icon: string;
  items: { id: string; text: string }[];
}

export interface KaufProzessContent {
  stand: string;
  steps: KaufStep[];
  besichtigung: ChecklistGroup[];
  unterlagen: {
    titel: string;
    items: { name: string; wozu: string }[];
  }[];
  nebenkosten: {
    name: string;
    satz: string;
    text: string;
  }[];
  provisionsregel: string[];
  vergleiche: {
    titel: string;
    spalten: [string, string];
    zeilen: { thema: string; a: string; b: string }[];
  }[];
  fehler: { titel: string; text: string }[];
}

/* ------------------------------ Simulation -------------------------- */

export interface SimStation extends Omit<Question, "topic"> {
  /** Name der Station im Kaufprozess, z. B. "Notartermin". */
  station: string;
  icon: string;
}

export interface SimulationContent {
  titel: string;
  intro: string;
  kaeufer: {
    name: string;
    beschreibung: string;
    fakten: { label: string; wert: string }[];
  };
  abschluss: string;
  stationen: SimStation[];
}

/* ------------------------------ Fortschritt ------------------------- */

export interface AnswerStat {
  correct: number;
  wrong: number;
  /** Zuletzt richtig beantwortet? */
  lastCorrect: boolean;
}

export interface Progress {
  version: 1;
  xp: number;
  streak: { current: number; best: number; lastDay: string | null };
  answered: Record<string, AnswerStat>;
  /** Fragen-IDs, die im Wiederholungsmodus wiederkommen. */
  review: string[];
  cards: Record<string, "known" | "unknown">;
  baujahr: {
    correct: number;
    total: number;
    byEpoch: Record<string, { correct: number; total: number }>;
  };
  daily: Record<string, { score: number; total: number }>;
  sim: { runs: number; best: number };
  checklist: Record<string, boolean>;
  createdAt: string;
}

export type AnswerMode = "quiz" | "review" | "daily" | "calc" | "sim";
