import { useEffect, useMemo, useRef, useState } from "react";
import type { Question } from "../types";
import { difficultyLabel, topicById } from "../lib/content";
import { shuffle } from "../lib/random";

interface Props {
  question: Question;
  /** Wird nach dem Antworten aufgerufen und gibt die verdienten XP zurück. */
  onAnswer: (correct: boolean) => number;
  onNext: () => void;
  isLast: boolean;
  /** Text auf dem Weiter-Button der letzten Frage. */
  lastLabel?: string;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function Dots({ level }: { level: number }) {
  return (
    <span className="tracking-widest text-amber-500" aria-label={`Schwierigkeit ${difficultyLabel[level]}`}>
      {"●".repeat(level)}
      <span className="text-slate-300">{"●".repeat(3 - level)}</span>
    </span>
  );
}

/**
 * Eine Frage mit Antwortmöglichkeiten. Nach JEDER Antwort (richtig oder falsch)
 * erscheint die vollständige Erklärung. Erst "Weiter" geht zur nächsten Frage.
 */
export function QuestionCard({ question: q, onAnswer, onNext, isLast, lastLabel }: Props) {
  // Antworten mischen, damit die richtige nicht immer an derselben Stelle steht.
  const order = useMemo(() => {
    const idx = q.options.map((_, i) => i);
    return q.fixedOrder ? idx : shuffle(idx);
  }, [q]);

  const [selected, setSelected] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const answered = selected !== null;
  const isCorrect = selected === q.correctAnswer;
  const topic = topicById(q.topic);

  useEffect(() => {
    if (answered) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [answered]);

  function choose(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setXp(onAnswer(optionIndex === q.correctAnswer));
  }

  function optionStyle(i: number): string {
    if (!answered) return "border-slate-200 bg-white active:bg-indigo-50 hover:border-indigo-300";
    if (i === q.correctAnswer) return "border-emerald-500 bg-emerald-50";
    if (i === selected) return "border-rose-500 bg-rose-50";
    return "border-slate-200 bg-white opacity-60";
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {topic && (
          <span className="chip bg-slate-100 text-slate-600">
            {topic.icon} {topic.title}
          </span>
        )}
        <Dots level={q.difficulty} />
        {q.stand && <span className="chip bg-amber-50 text-amber-700">📅 {q.stand}</span>}
      </div>

      {q.scenario && (
        <div className="mb-3 rounded-xl bg-indigo-50 p-3 text-[0.95rem] leading-relaxed text-indigo-900 ring-1 ring-indigo-100">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-indigo-600">
            Ausgangslage
          </span>
          {q.scenario}
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold leading-snug text-slate-900">{q.question}</h2>

      <div className="space-y-2.5" role="group" aria-label="Antwortmöglichkeiten">
        {order.map((optIdx, pos) => (
          <button
            key={optIdx}
            type="button"
            disabled={answered}
            onClick={() => choose(optIdx)}
            className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${optionStyle(optIdx)}`}
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                answered && optIdx === q.correctAnswer
                  ? "bg-emerald-600 text-white"
                  : answered && optIdx === selected
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {answered && optIdx === q.correctAnswer ? "✓" : answered && optIdx === selected ? "✗" : LETTERS[pos]}
            </span>
            <span className="text-[0.97rem] leading-snug text-slate-800">{q.options[optIdx]}</span>
          </button>
        ))}
      </div>

      {answered && (
        <div ref={panelRef} className="mt-5 scroll-mt-24 space-y-3 animate-slide-up">
          {/* Ergebnis */}
          <div
            className={`rounded-2xl p-4 ${
              isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-extrabold">
                {isCorrect ? "✅ Richtig!" : "❌ Nicht ganz – kein Problem!"}
              </span>
              {xp > 0 && <span className="chip animate-pop bg-white/25 text-white">+{xp} XP</span>}
            </div>
            {!isCorrect && (
              <p className="mt-1 text-sm text-white/90">
                Genau dafür ist die Erklärung da. Die Frage kommt später im Wiederholungsmodus wieder.
              </p>
            )}
          </div>

          {/* 1. Richtige Antwort */}
          <section className="card">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              1 · Die richtige Antwort
            </h3>
            <p className="font-semibold text-slate-900">{q.options[q.correctAnswer]}</p>
          </section>

          {/* Rechenweg (nur bei Rechenaufgaben) */}
          {q.steps && q.steps.length > 0 && (
            <section className="card ring-emerald-200">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                🧮 Rechenweg Schritt für Schritt
              </h3>
              <ol className="space-y-2">
                {q.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[0.95rem] leading-snug">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                      {i + 1}
                    </span>
                    <span className="font-mono text-[0.9rem] text-slate-800">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 2. Warum richtig */}
          <section className="card">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
              2 · Warum ist das richtig?
            </h3>
            <p className="leading-relaxed text-slate-800">{q.explanation}</p>
          </section>

          {/* 3. Warum die anderen falsch sind */}
          <section className="card">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-700">
              3 · Warum die anderen Antworten falsch sind
            </h3>
            <ul className="space-y-3">
              {order
                .filter((i) => i !== q.correctAnswer)
                .map((i) => (
                  <li key={i} className="text-[0.95rem] leading-snug">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-rose-600">✗</span>
                      <div>
                        <span className="font-semibold text-slate-900">{q.options[i]}</span>
                        {i === selected && (
                          <span className="chip ml-2 bg-rose-100 text-rose-700">deine Antwort</span>
                        )}
                        <p className="mt-0.5 text-slate-700">{q.wrongExplanations[i]}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>

          {/* 4. Praxis-Tipp */}
          <section className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              4 · 💡 Praxis-Tipp aus dem Makler-Alltag
            </h3>
            <p className="leading-relaxed text-amber-950">{q.practiceTip}</p>
          </section>

          <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
            <button type="button" className="btn btn-primary w-full" onClick={onNext}>
              {isLast ? (lastLabel ?? "Ergebnis ansehen") : "Weiter"} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
