/**
 * Lädt alle Lerninhalte aus src/data.
 *
 * Neue Fragen ergänzen: einfach in der passenden Datei unter src/data/questions/
 * ein weiteres Objekt zu "questions" hinzufügen. Neue Themen: Eintrag in
 * src/data/topics.json + Datei src/data/questions/<topic-id>.json anlegen.
 * Mit `npm run check-data` prüfst du danach, ob alle Felder stimmen.
 */
import type {
  Epoch,
  Flashcard,
  KaufProzessContent,
  Question,
  QuestionFile,
  SimulationContent,
  Topic,
} from "../types";
import topicsJson from "../data/topics.json";
import flashcardsJson from "../data/flashcards.json";
import epochsJson from "../data/epochs.json";
import kaufprozessJson from "../data/kaufprozess.json";
import simulationJson from "../data/simulation.json";

export const topics = topicsJson as unknown as Topic[];
export const flashcards = flashcardsJson as unknown as Flashcard[];
export const epochs = epochsJson as unknown as Epoch[];
export const kaufprozess = kaufprozessJson as unknown as KaufProzessContent;
export const simulation = simulationJson as unknown as SimulationContent;

export const topicById = (id: string): Topic | undefined => topics.find((t) => t.id === id);
export const epochById = (id: string): Epoch | undefined => epochs.find((e) => e.id === id);

/* Alle Dateien in src/data/questions/*.json werden automatisch eingelesen. */
const questionFiles = import.meta.glob("../data/questions/*.json", {
  eager: true,
  import: "default",
}) as Record<string, QuestionFile>;

export const questionFileMeta: Record<string, { stand?: string; hinweis?: string }> = {};

export const allQuestions: Question[] = Object.entries(questionFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([, file]) => {
    questionFileMeta[file.topic] = { stand: file.stand, hinweis: file.hinweis };
    return file.questions.map((q) => ({ ...q, topic: file.topic }) as Question);
  });

/** Simulations-Stationen sind auch "Fragen" (für Wiederholung und Fortschritt). */
export const simQuestions: Question[] = simulation.stationen.map(
  (s) => ({ ...s, topic: "simulation" }) as Question,
);

/** Nachschlagen aller Fragen (inkl. Simulation) per ID, z. B. für den Wiederholungsmodus. */
export const questionIndex = new Map<string, Question>(
  [...allQuestions, ...simQuestions].map((q) => [q.id, q]),
);

export const questionsByTopic = (topicId: string): Question[] =>
  allQuestions.filter((q) => q.topic === topicId);

export const flashcardsByTopic = (topicId: string): Flashcard[] =>
  flashcards.filter((c) => c.topic === topicId);

export const difficultyLabel = ["", "leicht", "mittel", "schwer"] as const;
