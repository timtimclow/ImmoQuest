import { useRef, useState, type ReactNode } from "react";
import type { AnswerMode, Question } from "../types";
import { useProgress } from "../lib/progress";
import { QuestionCard } from "./QuestionCard";
import { SessionHeader } from "./SessionHeader";

interface Result {
  q: Question;
  correct: boolean;
  xp: number;
}

interface Props {
  title: string;
  questions: Question[];
  mode: AnswerMode;
  onExit: () => void;
  onRestart?: () => void;
  restartLabel?: string;
  /** Wird am Ende einmal aufgerufen; gibt Bonus-XP zurück (z. B. Tages-Challenge). */
  onFinished?: (score: number, total: number) => number;
  emptyState?: ReactNode;
  /** Zusätzlicher Inhalt auf dem Ergebnis-Bildschirm. */
  finishExtra?: ReactNode;
  lastLabel?: string;
  /** Optional: Titel je Frage (z. B. Name der Simulations-Station). */
  getTitle?: (q: Question, index: number) => string;
  /** Optional: Zusatzanzeige unter dem Fortschrittsbalken (z. B. Reise-Leiste). */
  headerExtra?: (index: number) => ReactNode;
}

export function SessionRunner({
  title,
  questions,
  mode,
  onExit,
  onRestart,
  restartLabel = "Nochmal",
  onFinished,
  emptyState,
  finishExtra,
  lastLabel,
  getTitle,
  headerExtra,
}: Props) {
  const { answerQuestion } = useProgress();
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [finished, setFinished] = useState(false);
  const [bonus, setBonus] = useState(0);
  const finishedOnce = useRef(false);

  const total = questions.length;

  if (total === 0) {
    return (
      <div className="card mt-6 text-center">
        {emptyState ?? <p>Keine Fragen vorhanden.</p>}
        <button type="button" className="btn btn-primary mt-4" onClick={onExit}>
          Zurück
        </button>
      </div>
    );
  }

  if (finished) {
    const score = results.filter((r) => r.correct).length;
    const xpSum = results.reduce((s, r) => s + r.xp, 0) + bonus;
    const pct = score / total;
    const wrong = results.filter((r) => !r.correct);
    return (
      <div className="animate-slide-up pt-6 text-center">
        <div className="text-6xl">{pct >= 0.9 ? "🏆" : pct >= 0.6 ? "👍" : "💪"}</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
          {pct >= 0.9 ? "Stark!" : pct >= 0.6 ? "Gut gemacht!" : "Übung macht den Meister!"}
        </h1>
        <p className="mt-1 text-slate-600">
          {score} von {total} richtig · <span className="font-bold text-indigo-700">+{xpSum} XP</span>
          {bonus > 0 && <span className="text-emerald-700"> (inkl. {bonus} Bonus-XP)</span>}
        </p>

        {finishExtra}

        {wrong.length > 0 && (
          <div className="card mt-5 text-left">
            <h2 className="mb-2 font-bold text-slate-900">Das schaust du dir nochmal an</h2>
            <ul className="space-y-3">
              {wrong.map((r) => (
                <li key={r.q.id} className="text-sm leading-snug">
                  <p className="font-semibold text-slate-800">{r.q.question}</p>
                  <p className="mt-0.5 text-emerald-700">✓ {r.q.options[r.q.correctAnswer]}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Diese Fragen liegen jetzt im Wiederholungsmodus für dich bereit.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3">
          {onRestart && (
            <button type="button" className="btn btn-primary" onClick={onRestart}>
              🔁 {restartLabel}
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            Fertig
          </button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === total - 1;

  function handleAnswer(correct: boolean): number {
    const xp = answerQuestion(q, correct, mode);
    setResults((r) => [...r, { q, correct, xp }]);
    return xp;
  }

  function handleNext() {
    if (!isLast) {
      setIdx(idx + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    if (!finishedOnce.current) {
      finishedOnce.current = true;
      const score = results.filter((r) => r.correct).length;
      setBonus(onFinished?.(score, total) ?? 0);
    }
    setFinished(true);
    window.scrollTo({ top: 0 });
  }

  return (
    <div>
      <SessionHeader
        title={getTitle ? getTitle(q, idx) : title}
        index={idx}
        total={total}
        onExit={onExit}
        extra={headerExtra?.(idx)}
      />

      <QuestionCard
        key={q.id}
        question={q}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isLast={isLast}
        lastLabel={lastLabel}
      />
    </div>
  );
}
