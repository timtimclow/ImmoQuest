import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { flashcardsByTopic, questionFileMeta, questionsByTopic, topicById } from "../lib/content";
import { colorClasses } from "../lib/colors";
import { useProgress } from "../lib/progress";
import { masteredCount } from "../lib/sessions";

export function TopicPage() {
  const { id = "" } = useParams();
  const { progress } = useProgress();
  const topic = topicById(id);
  if (!topic) return <Navigate to="/" replace />;
  if (topic.id === "rechnen") return <Navigate to="/rechnen" replace />;

  const qs = questionsByTopic(topic.id);
  const done = masteredCount(progress, qs);
  const cards = flashcardsByTopic(topic.id);
  const cardsKnown = cards.filter((c) => progress.cards[c.id] === "known").length;
  const meta = questionFileMeta[topic.id];
  const c = colorClasses[topic.color];
  const counts = [1, 2, 3].map((d) => qs.filter((q) => q.difficulty === d).length);

  return (
    <div className="space-y-4">
      <PageHeader title={topic.title} icon={topic.icon} subtitle={topic.description} backTo="/" />

      <section className="card">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-bold text-slate-900">Dein Fortschritt</h2>
          <span className="text-sm font-semibold tabular-nums text-slate-600">
            {done} von {qs.length} gemeistert
          </span>
        </div>
        <ProgressBar value={qs.length ? done / qs.length : 0} barClass={c.bar} heightClass="h-3" />
        <p className="mt-2 text-xs text-slate-500">
          Fragen: {counts[0]} leicht · {counts[1]} mittel · {counts[2]} schwer. Eine Frage gilt als gemeistert,
          wenn du sie zuletzt richtig beantwortet hast.
        </p>
      </section>

      <div className="grid gap-3">
        <Link to={`/quiz/${topic.id}`} className="btn btn-primary text-lg">
          ▶ Quiz starten (10 Fragen)
        </Link>
        {topic.id === "architektur" && (
          <Link to="/baujahr" className="btn btn-secondary">
            🏚️ Zum Baujahr-Raten
          </Link>
        )}
        {topic.id === "kaufen" && (
          <>
            <Link to="/kaufen" className="btn btn-secondary">
              🔑 Lernseite: Kaufprozess von A bis Z
            </Link>
            <Link to="/simulation" className="btn btn-secondary">
              🏡 Kaufprozess-Simulation
            </Link>
            <Link to="/rechner" className="btn btn-secondary">
              🧮 Kaufnebenkosten-Rechner
            </Link>
          </>
        )}
        {cards.length > 0 && (
          <Link to={`/karteikarten/${topic.id}`} className="btn btn-secondary">
            🗂️ Karteikarten ({cardsKnown}/{cards.length} gekonnt)
          </Link>
        )}
      </div>

      {(meta?.stand || meta?.hinweis) && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          📅 <strong>{meta.stand}</strong>
          {meta.hinweis && <> – {meta.hinweis}</>}
        </p>
      )}
    </div>
  );
}
