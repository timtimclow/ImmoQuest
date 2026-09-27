import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AnswerMode, Level, Progress, Question } from "../types";
import { levelInfo, type LevelInfo } from "./levels";
import {
  CARD_XP,
  DAILY_BONUS_XP,
  applyAnswer,
  effectiveStreak,
  emptyProgress,
  loadProgress,
  normalizeProgress,
  saveProgress,
  touchStreak,
} from "./progressLogic";

interface ProgressApi {
  progress: Progress;
  level: LevelInfo;
  /** Aktuelle Streak (0, wenn der Faden gerissen ist). */
  streakDays: number;
  /** Gesetzt, wenn gerade ein Level-Aufstieg passiert ist (für den Glückwunsch-Dialog). */
  levelUp: Level | null;
  dismissLevelUp: () => void;
  /** Gibt die verdienten XP zurück. */
  answerQuestion: (q: Question, correct: boolean, mode: AnswerMode) => number;
  rateCard: (id: string, known: boolean) => number;
  recordBaujahr: (epochId: string, correct: boolean, xp: number) => number;
  /** Gibt den Bonus zurück (0, wenn die Tages-Challenge heute schon abgeschlossen wurde). */
  completeDaily: (date: string, score: number, total: number) => number;
  recordSim: (score: number, total: number) => void;
  toggleChecklist: (id: string) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const ref = useRef(progress);
  const [levelUp, setLevelUp] = useState<Level | null>(null);

  /** Zentrale Stelle: speichert, aktualisiert den State und erkennt Level-Aufstiege. */
  const commit = useCallback((next: Progress) => {
    const before = levelInfo(ref.current.xp).level;
    const after = levelInfo(next.xp);
    ref.current = next;
    setProgress(next);
    saveProgress(next);
    if (after.level > before) {
      setLevelUp({ level: after.level, xp: after.startXp, title: after.title });
    }
  }, []);

  const answerQuestion = useCallback(
    (q: Question, correct: boolean, mode: AnswerMode) => {
      const { next, xp } = applyAnswer(ref.current, q, correct, mode);
      commit(next);
      return xp;
    },
    [commit],
  );

  const rateCard = useCallback(
    (id: string, known: boolean) => {
      const p = ref.current;
      const wasKnown = p.cards[id] === "known";
      // XP nur, wenn die Karte zum ersten Mal als "kann ich" gilt.
      const xp = known && !wasKnown ? CARD_XP : 0;
      commit({
        ...p,
        xp: p.xp + xp,
        cards: { ...p.cards, [id]: known ? "known" : "unknown" },
        streak: touchStreak(p.streak),
      });
      return xp;
    },
    [commit],
  );

  const recordBaujahr = useCallback(
    (epochId: string, correct: boolean, xp: number) => {
      const p = ref.current;
      const e = p.baujahr.byEpoch[epochId] ?? { correct: 0, total: 0 };
      const gained = correct ? xp : 0;
      commit({
        ...p,
        xp: p.xp + gained,
        baujahr: {
          correct: p.baujahr.correct + (correct ? 1 : 0),
          total: p.baujahr.total + 1,
          byEpoch: {
            ...p.baujahr.byEpoch,
            [epochId]: { correct: e.correct + (correct ? 1 : 0), total: e.total + 1 },
          },
        },
        streak: touchStreak(p.streak),
      });
      return gained;
    },
    [commit],
  );

  const completeDaily = useCallback(
    (date: string, score: number, total: number) => {
      const p = ref.current;
      const already = Boolean(p.daily[date]);
      const bonus = already ? 0 : DAILY_BONUS_XP;
      commit({
        ...p,
        xp: p.xp + bonus,
        // Beim ersten Abschluss des Tages zählt das Ergebnis; Wiederholungen ändern es nicht.
        daily: already ? p.daily : { ...p.daily, [date]: { score, total } },
      });
      return bonus;
    },
    [commit],
  );

  const recordSim = useCallback(
    (score: number, total: number) => {
      const p = ref.current;
      const pct = Math.round((score / total) * 100);
      commit({ ...p, sim: { runs: p.sim.runs + 1, best: Math.max(p.sim.best, pct) } });
    },
    [commit],
  );

  const toggleChecklist = useCallback(
    (id: string) => {
      const p = ref.current;
      commit({ ...p, checklist: { ...p.checklist, [id]: !p.checklist[id] } });
    },
    [commit],
  );

  const reset = useCallback(() => {
    ref.current = emptyProgress();
    setProgress(ref.current);
    saveProgress(ref.current);
    setLevelUp(null);
  }, []);

  const exportJson = useCallback(() => JSON.stringify(ref.current), []);

  const importJson = useCallback(
    (json: string) => {
      try {
        const parsed = normalizeProgress(JSON.parse(json));
        if (!parsed) return false;
        ref.current = parsed;
        setProgress(parsed);
        saveProgress(parsed);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const value = useMemo<ProgressApi>(
    () => ({
      progress,
      level: levelInfo(progress.xp),
      streakDays: effectiveStreak(progress.streak),
      levelUp,
      dismissLevelUp: () => setLevelUp(null),
      answerQuestion,
      rateCard,
      recordBaujahr,
      completeDaily,
      recordSim,
      toggleChecklist,
      reset,
      exportJson,
      importJson,
    }),
    [
      progress,
      levelUp,
      answerQuestion,
      rateCard,
      recordBaujahr,
      completeDaily,
      recordSim,
      toggleChecklist,
      reset,
      exportJson,
      importJson,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress muss innerhalb von <ProgressProvider> verwendet werden");
  return v;
}
