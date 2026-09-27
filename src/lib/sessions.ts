import type { Progress, Question } from "../types";
import { allQuestions, questionIndex, questionsByTopic } from "./content";
import { hashString, seededRng, shuffle } from "./random";

/** Stabil nach Schwierigkeit sortieren (leicht → schwer). Vorher gemischt, damit gleiche Stufen zufällig sind. */
function byDifficulty(qs: Question[]): Question[] {
  return [...qs].sort((a, b) => a.difficulty - b.difficulty);
}

export function masteredCount(progress: Progress, qs: Question[]): number {
  return qs.filter((q) => progress.answered[q.id]?.lastCorrect).length;
}

/**
 * Quiz-Sitzung für ein Thema (max. `size` Fragen).
 * Reihenfolge der Auswahl: 1. noch nie beantwortet (leicht zuerst), 2. zuletzt falsch, 3. schon gekonnt.
 * Innerhalb der Sitzung geht es von leicht nach schwer.
 */
export function buildTopicSession(
  topicId: string,
  progress: Progress,
  size = 10,
  category?: string,
): Question[] {
  let pool = topicId === "alle" ? allQuestions : questionsByTopic(topicId);
  if (category && category !== "alle") pool = pool.filter((q) => q.category === category);

  const unseen = byDifficulty(shuffle(pool.filter((q) => !progress.answered[q.id])));
  const wrong = shuffle(pool.filter((q) => progress.answered[q.id] && !progress.answered[q.id].lastCorrect));
  const known = shuffle(pool.filter((q) => progress.answered[q.id]?.lastCorrect));

  const picked = [...unseen, ...wrong, ...known].slice(0, size);
  return byDifficulty(shuffle(picked));
}

/** Wiederholungsmodus: alle Fragen, die zuletzt falsch beantwortet wurden. */
export function buildReviewSession(progress: Progress, size = 10): Question[] {
  const qs = progress.review
    .map((id) => questionIndex.get(id))
    .filter((q): q is Question => Boolean(q));
  return shuffle(qs).slice(0, size);
}

/** Tages-Challenge: 5 gemischte Fragen, pro Tag immer dieselben (Seed = Datum). */
export function buildDailySession(dateKey: string, size = 5): Question[] {
  const rng = seededRng(hashString(`immoquest-${dateKey}`));
  const shuffled = shuffle(allQuestions, rng);
  const picked: Question[] = [];
  const usedTopics = new Set<string>();
  // Zuerst ein Thema nur einmal, damit es wirklich "gemischt" ist.
  for (const q of shuffled) {
    if (picked.length >= size) break;
    if (!usedTopics.has(q.topic)) {
      usedTopics.add(q.topic);
      picked.push(q);
    }
  }
  for (const q of shuffled) {
    if (picked.length >= size) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return byDifficulty(picked);
}
