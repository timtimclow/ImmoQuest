import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { kaufprozess as K } from "../lib/content";
import { useProgress } from "../lib/progress";

type Tab = "zeitstrahl" | "checkliste" | "unterlagen" | "kosten" | "vergleich" | "fehler";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "zeitstrahl", label: "Zeitstrahl", icon: "🧭" },
  { id: "checkliste", label: "Besichtigung", icon: "✅" },
  { id: "unterlagen", label: "Unterlagen", icon: "📑" },
  { id: "kosten", label: "Kosten", icon: "🧾" },
  { id: "vergleich", label: "Vergleiche", icon: "⚖️" },
  { id: "fehler", label: "Fehler", icon: "⚠️" },
];

export function KaufprozessPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab") as Tab | null;
  const tab: Tab = TABS.some((t) => t.id === requested) ? (requested as Tab) : "zeitstrahl";

  function setTab(t: Tab) {
    setParams({ tab: t }, { replace: true });
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kaufprozess von A bis Z"
        icon="🔑"
        subtitle="14 Schritte vom Budget bis zur Eintragung im Grundbuch – kurz und einfach erklärt."
      />

      <div className="grid grid-cols-3 gap-2">
        <Link to="/quiz/kaufen" className="btn btn-primary !min-h-11 !px-2 !py-2 text-sm">
          ❓ Quiz
        </Link>
        <Link to="/simulation" className="btn btn-secondary !min-h-11 !px-2 !py-2 text-sm">
          🏡 Simulation
        </Link>
        <Link to="/rechner" className="btn btn-secondary !min-h-11 !px-2 !py-2 text-sm">
          🧮 Rechner
        </Link>
      </div>

      {/* Tab-Leiste */}
      <div className="sticky top-[3.2rem] z-20 -mx-4 bg-slate-50/95 px-4 py-2 backdrop-blur">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "zeitstrahl" && <Timeline onTab={setTab} />}
      {tab === "checkliste" && <Checklist />}
      {tab === "unterlagen" && <Documents />}
      {tab === "kosten" && <Costs />}
      {tab === "vergleich" && <Comparisons />}
      {tab === "fehler" && <Mistakes />}

      <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
        📅 {K.stand}
      </p>
    </div>
  );
}

/* ------------------------------- Zeitstrahl ------------------------- */

function Timeline({ onTab }: { onTab: (t: Tab) => void }) {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (nr: number) => setOpen((o) => (o.includes(nr) ? o.filter((n) => n !== nr) : [...o, nr]));

  return (
    <div className="relative">
      <div className="absolute top-4 bottom-4 left-[1.05rem] w-0.5 bg-indigo-200" aria-hidden />
      <ol className="space-y-4">
        {K.steps.map((s) => {
          const isOpen = open.includes(s.nr);
          return (
            <li key={s.nr} className="relative pl-12">
              <span className="absolute top-2 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-extrabold text-white ring-4 ring-slate-50">
                {s.nr}
              </span>
              <div className="card">
                <button
                  type="button"
                  onClick={() => toggle(s.nr)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-2 text-left"
                >
                  <span className="text-2xl leading-none">{s.icon}</span>
                  <span className="flex-1">
                    <span className="block font-bold text-slate-900">{s.titel}</span>
                    <span className="mt-0.5 block text-[0.95rem] leading-snug text-slate-600">{s.kurz}</span>
                  </span>
                  <span className={`mt-1 text-slate-400 transition ${isOpen ? "rotate-90" : ""}`}>›</span>
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-3 border-t border-slate-100 pt-3 animate-slide-up">
                    <ul className="list-disc space-y-1.5 pl-5 text-[0.95rem] leading-snug text-slate-800">
                      {s.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <p className="rounded-xl bg-amber-50 p-3 text-sm leading-snug text-amber-950 ring-1 ring-amber-200">
                      💡 <strong>Tipp:</strong> {s.tipp}
                    </p>
                    {s.link === "rechner" && (
                      <Link to="/rechner" className="btn btn-secondary w-full !min-h-11">
                        🧮 Zum Budget-Rechner
                      </Link>
                    )}
                    {s.link === "checkliste" && (
                      <button type="button" className="btn btn-secondary w-full !min-h-11" onClick={() => onTab("checkliste")}>
                        ✅ Zur Besichtigungs-Checkliste
                      </button>
                    )}
                    {s.link === "unterlagen" && (
                      <button type="button" className="btn btn-secondary w-full !min-h-11" onClick={() => onTab("unterlagen")}>
                        📑 Zur Unterlagen-Liste
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------ Checkliste -------------------------- */

function Checklist() {
  const { progress, toggleChecklist } = useProgress();
  const all = K.besichtigung.flatMap((g) => g.items);
  const done = all.filter((i) => progress.checklist[i.id]).length;

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-bold text-slate-900">Besichtigungs-Checkliste</h2>
          <span className="text-sm font-semibold tabular-nums text-slate-600">
            {done}/{all.length}
          </span>
        </div>
        <ProgressBar value={all.length ? done / all.length : 0} barClass="bg-emerald-500" heightClass="h-3" />
        <p className="mt-2 text-xs text-slate-500">
          Hake beim Rundgang ab, was du geprüft hast. Deine Häkchen bleiben auf diesem Gerät gespeichert.
        </p>
      </section>

      {K.besichtigung.map((g) => {
        const gDone = g.items.filter((i) => progress.checklist[i.id]).length;
        return (
          <section key={g.id} className="card">
            <h3 className="mb-2 flex items-center justify-between font-bold text-slate-900">
              <span>
                {g.icon} {g.titel}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {gDone}/{g.items.length}
              </span>
            </h3>
            <ul className="space-y-1">
              {g.items.map((i) => {
                const checked = Boolean(progress.checklist[i.id]);
                return (
                  <li key={i.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 active:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecklist(i.id)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-600"
                      />
                      <span className={`text-[0.95rem] leading-snug ${checked ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {i.text}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ------------------------------- Unterlagen ------------------------- */

function Documents() {
  return (
    <div className="space-y-4">
      {K.unterlagen.map((g) => (
        <section key={g.titel} className="card">
          <h2 className="mb-3 font-bold text-slate-900">{g.titel}</h2>
          <ul className="space-y-3">
            {g.items.map((i) => (
              <li key={i.name} className="flex gap-2">
                <span className="mt-0.5 text-indigo-600">📄</span>
                <div>
                  <p className="font-semibold leading-snug text-slate-900">{i.name}</p>
                  <p className="text-sm leading-snug text-slate-600">{i.wozu}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* --------------------------------- Kosten --------------------------- */

function Costs() {
  return (
    <div className="space-y-4">
      <Link to="/rechner" className="btn btn-primary w-full">
        🧮 Kaufnebenkosten selbst ausrechnen
      </Link>

      {K.nebenkosten.map((n) => (
        <section key={n.name} className="card">
          <h2 className="font-bold text-slate-900">{n.name}</h2>
          <p className="mt-0.5 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700">
            {n.satz}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-700">{n.text}</p>
        </section>
      ))}

      <section className="card ring-amber-200">
        <h2 className="mb-2 font-bold text-slate-900">🤝 Maklerprovision: wer zahlt was?</h2>
        <ul className="list-disc space-y-2 pl-5 text-[0.95rem] leading-snug text-slate-800">
          {K.provisionsregel.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------- Vergleiche ------------------------ */

function Comparisons() {
  return (
    <div className="space-y-6">
      {K.vergleiche.map((v) => (
        <section key={v.titel} className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">{v.titel}</h2>
          <div className="grid grid-cols-2 gap-2 text-center text-sm font-bold">
            <span className="rounded-lg bg-indigo-600 py-1.5 text-white">{v.spalten[0]}</span>
            <span className="rounded-lg bg-teal-600 py-1.5 text-white">{v.spalten[1]}</span>
          </div>
          {v.zeilen.map((z) => (
            <div key={z.thema} className="card !p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{z.thema}</p>
              <div className="grid grid-cols-2 gap-3 text-[0.9rem] leading-snug text-slate-800">
                <p className="rounded-lg bg-indigo-50 p-2">{z.a}</p>
                <p className="rounded-lg bg-teal-50 p-2">{z.b}</p>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/* --------------------------------- Fehler --------------------------- */

function Mistakes() {
  return (
    <div className="space-y-3">
      <p className="text-slate-600">Diese Fehler machen Käufer besonders oft. Wenn du sie kennst, kannst du sie vermeiden – und deine Kunden davor warnen.</p>
      {K.fehler.map((f, i) => (
        <section key={f.titel} className="card flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
            {i + 1}
          </span>
          <div>
            <h2 className="font-bold text-slate-900">{f.titel}</h2>
            <p className="mt-0.5 text-[0.95rem] leading-snug text-slate-700">{f.text}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
