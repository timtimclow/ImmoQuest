import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SessionRunner } from "../components/SessionRunner";
import { simQuestions, simulation } from "../lib/content";
import { useProgress } from "../lib/progress";

export function SimulationIntro() {
  const { progress } = useProgress();
  const k = simulation.kaeufer;

  return (
    <div className="space-y-4">
      <PageHeader title={simulation.titel} icon="🏡" backTo="/spielen" subtitle={simulation.intro} />

      <section className="card space-y-3">
        <h2 className="font-bold text-slate-900">Dein Kunde: {k.name}</h2>
        <p className="text-slate-700">{k.beschreibung}</p>
        <dl className="grid grid-cols-2 gap-2">
          {k.fakten.map((f) => (
            <div key={f.label} className="rounded-xl bg-slate-50 p-2.5">
              <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-500">{f.label}</dt>
              <dd className="text-sm font-semibold text-slate-900">{f.wert}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card">
        <h2 className="mb-2 font-bold text-slate-900">Die Reise: {simulation.stationen.length} Stationen</h2>
        <ol className="space-y-1.5 text-sm">
          {simulation.stationen.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {i + 1}
              </span>
              <span>
                {s.icon} {s.station}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Link to="/simulation/spiel" className="btn btn-primary w-full text-lg">
        ▶ Reise starten
      </Link>
      {progress.sim.runs > 0 && (
        <p className="text-center text-sm text-slate-500">
          Bisher {progress.sim.runs}× gespielt · Bestwert {progress.sim.best} %
        </p>
      )}
    </div>
  );
}

/** Reise-Leiste: zeigt, an welcher Station des Kaufprozesses man gerade ist. */
function Journey({ current }: { current: number }) {
  const stations = simulation.stationen;
  return (
    <div className="mt-2 flex items-center gap-0.5" aria-hidden>
      {stations.map((s, i) => (
        <div key={s.id} className="flex flex-1 items-center">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] ${
              i < current
                ? "bg-emerald-500 text-white"
                : i === current
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-200"
                  : "bg-slate-200 text-slate-400"
            }`}
          >
            {i < current ? "✓" : ""}
          </div>
          {i < stations.length - 1 && <div className={`h-0.5 flex-1 ${i < current ? "bg-emerald-400" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}

export function SimulationGame() {
  const [round, setRound] = useState(0);
  return <SimulationRound key={round} onRestart={() => setRound((r) => r + 1)} />;
}

function SimulationRound({ onRestart }: { onRestart: () => void }) {
  const navigate = useNavigate();
  const { recordSim } = useProgress();

  return (
    <SessionRunner
      title="Kaufprozess-Simulation"
      questions={simQuestions}
      mode="sim"
      onExit={() => navigate("/simulation")}
      onRestart={onRestart}
      restartLabel="Reise nochmal machen"
      lastLabel="Zur Schlüsselübergabe"
      getTitle={(q, i) => {
        const s = simulation.stationen.find((x) => x.id === q.id);
        return `Station ${i + 1}: ${s?.icon ?? ""} ${s?.station ?? ""}`;
      }}
      headerExtra={(i) => <Journey current={i} />}
      onFinished={(score, total) => {
        recordSim(score, total);
        return 0;
      }}
      finishExtra={
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-4 text-left ring-1 ring-amber-200">
          <div className="text-2xl">🔑</div>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-amber-950">{simulation.abschluss}</p>
        </div>
      }
    />
  );
}
