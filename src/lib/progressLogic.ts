import { dayKey, yesterdayKey } from "./date";
import type { AnswerMode, AnswerStat, Difficulty, Progress, Question } from "../types";

/** Schlüssel im localStorage. Bei größeren Änderungen am Datenformat Version erhöhen. */
export const STORAGE_KEY = "immoquest.progress.v1";

export function emptyProgress(): Progress {
  return {
    version: 1,
    xp: 0,
    streak: { current: 0, best: 0, lastDay: null },
    answered: {},
    review: [],
    cards: {},
    baujahr: { correct: 0, total: 0, byEpoch: {} },
    daily: {},
    sim: { runs: 0, best: 0 },
    checklist: {},
    createdAt: new Date().toISOString(),
  };
}

/** Fehlende Felder (z. B. nach App-Updates oder Import) mit Standardwerten auffüllen. */
export function normalizeProgress(raw: unknown): Progress | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Progress>;
  if (r.version !== 1) return null;
  const base = emptyProgress();
  return {
    ...base,
    ...r,
    streak: { ...base.streak, ...(r.streak ?? {}) },
    baujahr: { ...base.baujahr, ...(r.baujahr ?? {}) },
    sim: { ...base.sim, ...(r.sim ?? {}) },
    answered: r.answered ?? {},
    review: Array.isArray(r.review) ? r.review : [],
    cards: r.cards ?? {},
    daily: r.daily ?? {},
    checklist: r.checklist ?? {},
  };
}

export function loadProgress(): Progress {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (text) {
      const parsed = normalizeProgress(JSON.parse(text));
      if (parsed) return parsed;
    }
  } catch {
    /* localStorage nicht verfügbar oder kaputt → neu anfangen */
  }
  return emptyProgress();
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* Speicher voll / privater Modus – die App läuft trotzdem weiter */
  }
}

/* -------------------------------- Streak ---------------------------- */

/** Streak = Tage in Folge, an denen etwas gelernt wurde. */
export function touchStreak(s: Progress["streak"], today = dayKey()): Progress["streak"] {
  if (s.lastDay === today) return s;
  const current = s.lastDay === yesterdayKey() ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastDay: today };
}

/** Angezeigte Streak: reißt der Faden (gestern nichts gelernt), steht sie bei 0. */
export function effectiveStreak(s: Progress["streak"]): number {
  if (!s.lastDay) return 0;
  return s.lastDay === dayKey() || s.lastDay === yesterdayKey() ? s.current : 0;
}

/* --------------------------------- XP ------------------------------- */

const BASE_XP: Record<Difficulty, number> = { 1: 10, 2: 15, 3: 20 };

export function xpForAnswer(
  q: Pick<Question, "difficulty">,
  correct: boolean,
  mode: AnswerMode,
  prev?: AnswerStat,
): number {
  if (!correct) return 0;
  let xp = BASE_XP[q.difficulty];
  // Wiederholte Fragen geben nur noch halbe XP – sonst könnte man XP "farmen".
  if (mode === "review" || (prev && prev.correct > 0)) xp = Math.ceil(xp / 2);
  return xp;
}

export function applyAnswer(
  p: Progress,
  q: Question,
  correct: boolean,
  mode: AnswerMode,
): { next: Progress; xp: number } {
  const prev = p.answered[q.id];
  const xp = xpForAnswer(q, correct, mode, prev);
  const stat: AnswerStat = {
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    wrong: (prev?.wrong ?? 0) + (correct ? 0 : 1),
    lastCorrect: correct,
  };
  // Falsch → kommt im Wiederholungsmodus wieder. Richtig → wird aus der Liste entfernt.
  const review = correct
    ? p.review.filter((id) => id !== q.id)
    : p.review.includes(q.id)
      ? p.review
      : [...p.review, q.id];
  return {
    next: {
      ...p,
      xp: p.xp + xp,
      answered: { ...p.answered, [q.id]: stat },
      review,
      streak: touchStreak(p.streak),
    },
    xp,
  };
}

export const CARD_XP = 3;
export const DAILY_BONUS_XP = 25;
