import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { useProgress } from "../lib/progress";

const MODES = [
  {
    to: "/quiz/alle",
    icon: "❓",
    title: "Quiz",
    text: "Multiple Choice aus allen Themen – mit Erklärung nach jeder Antwort.",
    color: "bg-indigo-50",
  },
  {
    to: "/baujahr",
    icon: "🏚️",
    title: "Baujahr-Raten",
    text: "Welche Bauepoche siehst du? Erkenne Fachwerk, Gründerzeit, Bauhaus & Co.",
    color: "bg-rose-50",
  },
  {
    to: "/karteikarten",
    icon: "🗂️",
    title: "Karteikarten",
    text: "Fachbegriffe üben: „kann ich“ oder „kann ich nicht“.",
    color: "bg-sky-50",
  },
  {
    to: "/rechnen",
    icon: "🧮",
    title: "Rechen-Challenges",
    text: "Nebenkosten, Grunderwerbsteuer, Rendite, Warmmiete, Annuität.",
    color: "bg-emerald-50",
  },
  {
    to: "/simulation",
    icon: "🏡",
    title: "Kaufprozess-Simulation",
    text: "Begleite einen Käufer vom Budget bis zur Schlüsselübergabe.",
    color: "bg-amber-50",
  },
  {
    to: "/tages-challenge",
    icon: "📅",
    title: "Tages-Challenge",
    text: "5 gemischte Fragen pro Tag – mit Bonus-XP.",
    color: "bg-orange-50",
  },
];

export function Play() {
  const { progress } = useProgress();
  const reviewCount = progress.review.length;
  return (
    <div>
      <PageHeader title="Spielen" icon="🎮" subtitle="Such dir einen Modus aus. Nach jeder Antwort gibt es eine Erklärung." />
      <div className="grid gap-3">
        {MODES.map((m) => (
          <Link key={m.to} to={m.to} className="card flex items-center gap-4 transition active:scale-[0.99]">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${m.color}`}>
              {m.icon}
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900">{m.title}</h2>
              <p className="text-sm leading-snug text-slate-600">{m.text}</p>
            </div>
            <span className="text-xl text-slate-400">›</span>
          </Link>
        ))}
        <Link to="/wiederholen" className="card flex items-center gap-4 transition active:scale-[0.99]">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-3xl">🔁</span>
          <div className="flex-1">
            <h2 className="font-bold text-slate-900">Wiederholungsmodus</h2>
            <p className="text-sm leading-snug text-slate-600">
              {reviewCount > 0
                ? `${reviewCount} falsch beantwortete Fragen warten auf dich.`
                : "Falsch beantwortete Fragen kommen hier wieder."}
            </p>
          </div>
          <span className="text-xl text-slate-400">›</span>
        </Link>
      </div>
    </div>
  );
}
