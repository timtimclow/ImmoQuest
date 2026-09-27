import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EpochImage } from "../components/EpochImage";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { SessionHeader } from "../components/SessionHeader";
import { epochById, epochs } from "../lib/content";
import { useProgress } from "../lib/progress";
import { shuffle } from "../lib/random";
import type { Epoch } from "../types";

const BASE_XP = 15;
const HINT_COST = 5;
const MIN_XP = 5;

/* ------------------------------ Einstieg ---------------------------- */

export function BaujahrIntro() {
  const { progress } = useProgress();
  const b = progress.baujahr;
  const pct = b.total ? Math.round((b.correct / b.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Baujahr-Raten"
        icon="🏚️"
        backTo="/spielen"
        subtitle="Du siehst ein Haus und schätzt die Bauepoche. Danach erfährst du, woran man sie erkennt und worauf beim Verkauf zu achten ist."
      />

      <div className="grid gap-3">
        <Link to="/baujahr/spiel" className="btn btn-primary text-lg">
          ▶ Runde starten (8 Häuser)
        </Link>
        <Link to="/baujahr/epochen" className="btn btn-secondary">
          📖 Erst die Epochen kennenlernen
        </Link>
      </div>

      <section className="card">
        <h2 className="mb-2 font-bold text-slate-900">So funktioniert es</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Du siehst Fotos (frei lizenziert, mit Quellenangabe) oder selbst gezeichnete Illustrationen. Die
            Erklärung zeigt immer die typischen Merkmale als Zeichnung.
          </li>
          <li>Ein Hinweis kostet {HINT_COST} XP, hilft aber beim Einordnen.</li>
          <li>Nach jeder Antwort erklärt die App die Merkmale und zeigt Verkaufs-Tipps.</li>
        </ul>
      </section>

      {b.total > 0 && (
        <section className="card">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-bold text-slate-900">Deine Trefferquote</h2>
            <span className="text-sm font-semibold text-slate-600">
              {pct} % · {b.correct}/{b.total}
            </span>
          </div>
          <ul className="space-y-2">
            {epochs.map((e) => {
              const s = b.byEpoch[e.id];
              return (
                <li key={e.id} className="flex items-center gap-2 text-sm">
                  <span className="w-36 shrink-0 truncate text-slate-700">{e.name}</span>
                  <div className="flex-1">
                    <ProgressBar
                      value={s?.total ? s.correct / s.total : 0}
                      barClass="bg-rose-500"
                      heightClass="h-2"
                    />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums text-slate-500">
                    {s ? `${s.correct}/${s.total}` : "–"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ------------------------------- Spiel ------------------------------ */

interface RoundResult {
  epoch: Epoch;
  chosen: string;
  correct: boolean;
  xp: number;
}

export function BaujahrGame() {
  const [round, setRound] = useState(0);
  return <BaujahrRound key={round} onRestart={() => setRound((r) => r + 1)} />;
}

function BaujahrRound({ onRestart }: { onRestart: () => void }) {
  const navigate = useNavigate();
  const { recordBaujahr } = useProgress();
  const [order] = useState(() => shuffle(epochs));
  const [idx, setIdx] = useState(0);
  const [hints, setHints] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const epoch = order[idx];
  const answered = chosen !== null;

  useEffect(() => {
    if (answered) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [answered]);

  function choose(id: string) {
    if (answered) return;
    const correct = id === epoch.id;
    const possible = Math.max(MIN_XP, BASE_XP - hints * HINT_COST);
    const xp = recordBaujahr(epoch.id, correct, possible);
    setChosen(id);
    setResults((r) => [...r, { epoch, chosen: id, correct, xp }]);
  }

  function next() {
    if (idx + 1 < order.length) {
      setIdx(idx + 1);
      setHints(0);
      setChosen(null);
      window.scrollTo({ top: 0 });
    } else {
      setFinished(true);
      window.scrollTo({ top: 0 });
    }
  }

  if (finished) {
    const score = results.filter((r) => r.correct).length;
    const xp = results.reduce((s, r) => s + r.xp, 0);
    return (
      <div className="animate-slide-up pt-6 text-center">
        <div className="text-6xl">{score >= 7 ? "🏆" : score >= 5 ? "👍" : "💪"}</div>
        <h1 className="mt-3 text-2xl font-extrabold">
          {score} von {order.length} Epochen erkannt
        </h1>
        <p className="mt-1 text-slate-600">
          <span className="font-bold text-indigo-700">+{xp} XP</span>
        </p>
        <ul className="card mt-5 space-y-2 text-left text-sm">
          {results.map((r) => (
            <li key={r.epoch.id} className="flex items-start gap-2">
              <span>{r.correct ? "✅" : "❌"}</span>
              <span>
                <strong>{r.epoch.name}</strong>
                {!r.correct && (
                  <span className="text-slate-500"> – du hast „{epochById(r.chosen)?.name}“ getippt</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            🔁 Nochmal spielen
          </button>
          <Link to="/baujahr/epochen" className="btn btn-secondary">
            📖 Epochen nachlesen
          </Link>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/baujahr")}>
            Fertig
          </button>
        </div>
      </div>
    );
  }

  const chosenEpoch = chosen ? epochById(chosen) : undefined;
  const correct = chosen === epoch.id;
  const lastResult = results[results.length - 1];

  return (
    <div>
      <SessionHeader title="Baujahr-Raten" index={idx} total={order.length} onExit={() => navigate("/baujahr")} />

      <div className="animate-slide-up">
        <EpochImage epoch={epoch} />
        <h2 className="mt-4 text-lg font-bold text-slate-900">Aus welcher Bauepoche stammt dieses Haus?</h2>

        {/* Hinweise */}
        {!answered && (
          <div className="mt-2">
            {hints > 0 && (
              <ul className="mb-2 space-y-1 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
                {epoch.hinweise.slice(0, hints).map((h, i) => (
                  <li key={i}>💡 {h}</li>
                ))}
              </ul>
            )}
            {hints < epoch.hinweise.length && (
              <button
                type="button"
                onClick={() => setHints(hints + 1)}
                className="text-sm font-semibold text-amber-700 underline"
              >
                💡 Hinweis anzeigen (−{HINT_COST} XP)
              </button>
            )}
          </div>
        )}

        {/* Auswahl */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {epochs.map((e) => {
            let style = "border-slate-200 bg-white active:bg-indigo-50";
            if (answered) {
              if (e.id === epoch.id) style = "border-emerald-500 bg-emerald-50";
              else if (e.id === chosen) style = "border-rose-500 bg-rose-50";
              else style = "border-slate-200 bg-white opacity-50";
            }
            return (
              <button
                key={e.id}
                type="button"
                disabled={answered}
                onClick={() => choose(e.id)}
                className={`rounded-xl border-2 p-2.5 text-left transition ${style}`}
              >
                <span className="block text-[0.9rem] font-bold leading-tight text-slate-900">{e.name}</span>
                <span className="block text-xs text-slate-500">{e.zeitraum}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div ref={panelRef} className="mt-5 scroll-mt-24 space-y-3 animate-slide-up">
            <div className={`rounded-2xl p-4 text-white ${correct ? "bg-emerald-600" : "bg-rose-600"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-extrabold">{correct ? "✅ Richtig!" : "❌ Nicht ganz – kein Problem!"}</span>
                {lastResult && lastResult.xp > 0 && (
                  <span className="chip animate-pop bg-white/25 text-white">+{lastResult.xp} XP</span>
                )}
              </div>
            </div>

            <section className="card">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700">1 · Die richtige Antwort</h3>
              <p className="font-semibold text-slate-900">
                {epoch.name} <span className="font-normal text-slate-500">({epoch.zeitraum})</span>
              </p>
            </section>

            <section className="card">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-700">2 · So erkennst du die Epoche</h3>
              <p className="mb-3 text-slate-800">{epoch.signature}</p>
              <EpochImage epoch={epoch} showMarkers mode="svg" />
              <p className="mt-3 mb-2 text-xs text-slate-500">
                {epoch.photo
                  ? "Die Zeichnung zeigt die typischen Merkmale der Epoche. Die Zahlen gehören zu dieser Liste:"
                  : "Die Zahlen in der Zeichnung gehören zu diesen Merkmalen:"}
              </p>
              <ol className="space-y-2">
                {epoch.merkmale.map((m, i) => (
                  <li key={i} className="flex gap-2 text-[0.95rem] leading-snug">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-slate-900">{m.text}.</strong>{" "}
                      {m.detail && <span className="text-slate-700">{m.detail}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {!correct && chosenEpoch && (
              <section className="card">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-rose-700">
                  3 · Warum nicht „{chosenEpoch.name}“?
                </h3>
                <p className="leading-relaxed text-slate-800">
                  {epoch.verwechslung[chosenEpoch.id] ?? `Typisch für ${chosenEpoch.name} wäre: ${chosenEpoch.signature}`}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <strong>Zum Vergleich – {chosenEpoch.name}:</strong> {chosenEpoch.signature}
                </p>
              </section>
            )}

            <section className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700">
                {correct ? "3" : "4"} · 💡 Worauf beim Verkauf oder Kauf zu achten ist
              </h3>
              <ul className="space-y-2">
                {epoch.verkauf.map((v, i) => (
                  <li key={i} className="text-[0.95rem] leading-snug text-amber-950">
                    <strong>{v.thema}:</strong> {v.text}
                  </li>
                ))}
              </ul>
            </section>

            <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
              <button type="button" className="btn btn-primary w-full" onClick={next}>
                {idx + 1 === order.length ? "Ergebnis ansehen" : "Weiter"} →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Epochen-Übersicht --------------------- */

export function EpochGallery() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bauepochen im Überblick"
        icon="📖"
        backTo="/baujahr"
        subtitle="Die nummerierten Punkte in den Zeichnungen zeigen die Erkennungsmerkmale."
      />
      {epochs.map((e) => (
        <article key={e.id} className="card space-y-3">
          <header>
            <h2 className="text-xl font-extrabold text-slate-900">{e.name}</h2>
            <p className="text-sm font-semibold text-rose-700">{e.zeitraum}</p>
          </header>
          {e.photo && <EpochImage epoch={e} mode="photo" />}
          <EpochImage epoch={e} showMarkers mode="svg" />
          <p className="font-medium text-slate-800">{e.signature}</p>
          <ol className="space-y-2">
            {e.merkmale.map((m, i) => (
              <li key={i} className="flex gap-2 text-[0.95rem] leading-snug">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>
                  <strong>{m.text}.</strong> <span className="text-slate-700">{m.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              Worauf beim Verkauf achten
            </h3>
            <ul className="space-y-1.5 text-sm text-amber-950">
              {e.verkauf.map((v, i) => (
                <li key={i}>
                  <strong>{v.thema}:</strong> {v.text}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
      <Link to="/baujahr/spiel" className="btn btn-primary w-full">
        ▶ Jetzt Baujahr-Raten spielen
      </Link>
    </div>
  );
}
