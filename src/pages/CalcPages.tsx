import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { SessionRunner } from "../components/SessionRunner";
import kategorien from "../data/rechnen-kategorien.json";
import { LEGAL, LEGAL_STAND } from "../data/legal";
import { questionsByTopic } from "../lib/content";
import { useProgress } from "../lib/progress";
import { buildTopicSession, masteredCount } from "../lib/sessions";

interface Kategorie {
  id: string;
  icon: string;
  text: string;
}
const categories = kategorien as Kategorie[];

export function CalcMenu() {
  const { progress } = useProgress();
  const all = questionsByTopic("rechnen");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Rechen-Challenges"
        icon="🧮"
        backTo="/spielen"
        subtitle="Nach jeder Aufgabe zeigt die App den kompletten Rechenweg Schritt für Schritt. Die falschen Antworten sind typische Rechenfehler."
      />

      <Link to="/rechnen/alle" className="btn btn-primary text-lg">
        ▶ Gemischte Runde starten
      </Link>

      <ul className="space-y-2.5">
        {categories.map((c) => {
          const qs = all.filter((q) => q.category === c.id);
          const done = masteredCount(progress, qs);
          return (
            <li key={c.id}>
              <Link to={`/rechnen/${encodeURIComponent(c.id)}`} className="card flex items-center gap-3 transition active:scale-[0.99]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate font-bold text-slate-900">{c.id}</h3>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
                      {done}/{qs.length}
                    </span>
                  </div>
                  <p className="text-sm leading-snug text-slate-600">{c.text}</p>
                  <div className="mt-1.5">
                    <ProgressBar value={qs.length ? done / qs.length : 0} barClass="bg-emerald-500" heightClass="h-2" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
        📅 <strong>Annahmen in den Aufgaben:</strong> Grunderwerbsteuer Niedersachsen {LEGAL.grunderwerbsteuerNiedersachsen} %, Notar +
        Grundbuch {LEGAL.notarProzent + LEGAL.grundbuchProzent} %, Käuferprovision {LEGAL.maklerKaeuferProzent} %. {LEGAL_STAND}.
        Diese Werte können sich ändern.
      </p>
    </div>
  );
}

export function CalcPage() {
  const { category = "alle" } = useParams();
  const [round, setRound] = useState(0);
  return <CalcRound key={round} category={decodeURIComponent(category)} onRestart={() => setRound((r) => r + 1)} />;
}

function CalcRound({ category, onRestart }: { category: string; onRestart: () => void }) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [questions] = useState(() => buildTopicSession("rechnen", progress, 8, category));
  return (
    <SessionRunner
      title={`Rechnen · ${category === "alle" ? "gemischt" : category}`}
      questions={questions}
      mode="calc"
      onExit={() => navigate("/rechnen")}
      onRestart={onRestart}
      restartLabel="Nächste Runde"
    />
  );
}
