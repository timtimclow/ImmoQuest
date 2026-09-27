import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { LEGAL_STAND } from "../data/legal";
import { allQuestions, flashcards } from "../lib/content";
import { levels } from "../lib/levels";
import { useProgress } from "../lib/progress";
import { masteredCount } from "../lib/sessions";

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card text-center">
      <div className="text-2xl font-extrabold text-indigo-700">{value}</div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      {sub && <div className="text-[0.7rem] text-slate-400">{sub}</div>}
    </div>
  );
}

export function ProfilePage() {
  const { progress, level, streakDays, reset, exportJson, importJson } = useProgress();
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);

  const attempts = Object.values(progress.answered).reduce((s, a) => s + a.correct + a.wrong, 0);
  const correct = Object.values(progress.answered).reduce((s, a) => s + a.correct, 0);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const mastered = masteredCount(progress, allQuestions);
  const cardsKnown = flashcards.filter((c) => progress.cards[c.id] === "known").length;
  const bj = progress.baujahr;
  const bjPct = bj.total ? Math.round((bj.correct / bj.total) * 100) : 0;
  const dailyDays = Object.keys(progress.daily).length;

  async function copyExport() {
    const json = exportJson();
    setExportText(json);
    try {
      await navigator.clipboard.writeText(json);
      setMessage("Fortschritt in die Zwischenablage kopiert. Auf dem anderen Gerät unten einfügen.");
    } catch {
      setMessage("Kopieren nicht möglich – markiere den Text unten und kopiere ihn von Hand.");
    }
  }

  function doImport() {
    if (!importText.trim()) return;
    if (!window.confirm("Aktuellen Fortschritt durch den importierten ersetzen?")) return;
    setMessage(importJson(importText.trim()) ? "✅ Fortschritt importiert." : "❌ Das sind keine gültigen ImmoQuest-Daten.");
    setImportText("");
  }

  function doReset() {
    if (window.confirm("Wirklich ALLEN Fortschritt (XP, Level, Streak, Wiederholungen) löschen?")) {
      reset();
      setExportText(null);
      setMessage("Fortschritt zurückgesetzt.");
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Profil" icon="👤" />

      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
        <p className="text-sm font-semibold text-indigo-100">Level {level.level}</p>
        <h2 className="text-3xl font-extrabold">{level.title}</h2>
        <div className="mt-3">
          <ProgressBar value={level.fraction} barClass="bg-amber-300" trackClass="bg-white/25" heightClass="h-3" />
          <p className="mt-1 text-xs text-indigo-100">
            {progress.xp} XP · nächstes Level bei {level.nextXp} XP
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Aktuelle Streak" value={`🔥 ${streakDays}`} sub={`Rekord: ${progress.streak.best} Tage`} />
        <Stat label="Trefferquote" value={`${accuracy} %`} sub={`${correct} von ${attempts} Antworten`} />
        <Stat label="Fragen gemeistert" value={`${mastered}/${allQuestions.length}`} />
        <Stat label="Karteikarten gekonnt" value={`${cardsKnown}/${flashcards.length}`} />
        <Stat label="Baujahr-Raten" value={bj.total ? `${bjPct} %` : "–"} sub={`${bj.correct} von ${bj.total} richtig`} />
        <Stat label="Tages-Challenges" value={dailyDays} sub={`Simulation: Bestwert ${progress.sim.best} %`} />
      </div>

      <section className="card">
        <h2 className="mb-3 font-bold text-slate-900">Rang-Leiter</h2>
        <ul className="space-y-1.5">
          {levels.map((l) => {
            const reached = progress.xp >= l.xp;
            return (
              <li
                key={l.level}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
                  l.level === level.level
                    ? "bg-indigo-600 font-bold text-white"
                    : reached
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-50 text-slate-400"
                }`}
              >
                <span>
                  {reached ? "✓" : "🔒"} Level {l.level} · {l.title}
                </span>
                <span className="tabular-nums">{l.xp} XP</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold text-slate-900">Fortschritt sichern & übertragen</h2>
        <p className="text-sm text-slate-600">
          Dein Fortschritt liegt nur in diesem Browser (localStorage). Willst du am Handy weitermachen, kopiere ihn
          hier heraus und füge ihn dort ein.
        </p>
        <button type="button" className="btn btn-secondary w-full" onClick={copyExport}>
          📋 Fortschritt exportieren
        </button>
        {exportText && (
          <textarea
            readOnly
            value={exportText}
            rows={3}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
          />
        )}
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={3}
          placeholder="Exportierten Fortschritt hier einfügen …"
          className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
        />
        <button type="button" className="btn btn-secondary w-full" onClick={doImport} disabled={!importText.trim()}>
          📥 Fortschritt importieren
        </button>
        {message && <p className="text-sm font-semibold text-indigo-700">{message}</p>}
      </section>

      <section className="card space-y-2 text-sm text-slate-600">
        <h2 className="font-bold text-slate-900">Hinweise</h2>
        <p>
          <strong>Rechtliche Angaben:</strong> {LEGAL_STAND}. Steuersätze, Provisionsregeln und Fristen können sich
          ändern. ImmoQuest ist ein Lernspiel und ersetzt keine Rechts- oder Steuerberatung.
        </p>
        <p>
          <strong>Bilder:</strong> Die Illustrationen sind selbst gezeichnet. Die Fotos im Baujahr-Raten stammen von
          Wikimedia Commons (freie Lizenzen, Urheber und Quelle stehen unter jedem Foto). Weitere Fotos trägst du
          in <code>src/data/epochs.json</code> ein, samt Lizenzangabe.
        </p>
      </section>

      <button type="button" className="btn btn-danger w-full" onClick={doReset}>
        🗑️ Fortschritt zurücksetzen
      </button>
    </div>
  );
}
