import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { SessionHeader } from "../components/SessionHeader";
import { colorClasses } from "../lib/colors";
import { flashcards, flashcardsByTopic, topicById, topics } from "../lib/content";
import { useProgress } from "../lib/progress";
import { shuffle } from "../lib/random";
import type { Flashcard } from "../types";

/* ------------------------------- Menü ------------------------------- */

export function FlashcardsMenu() {
  const { progress } = useProgress();
  const known = flashcards.filter((c) => progress.cards[c.id] === "known").length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Karteikarten"
        icon="🗂️"
        backTo="/spielen"
        subtitle="Lies den Begriff, überlege kurz, dreh die Karte um und bewerte dich ehrlich: „Kann ich“ oder „Kann ich nicht“."
      />

      <Link to="/karteikarten/alle" className="card flex items-center gap-4 ring-indigo-200 transition active:scale-[0.99]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">🎴</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold text-slate-900">Alle Themen gemischt</h2>
            <span className="text-xs font-semibold tabular-nums text-slate-500">
              {known}/{flashcards.length}
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={flashcards.length ? known / flashcards.length : 0} heightClass="h-2" />
          </div>
        </div>
      </Link>

      <ul className="space-y-2.5">
        {topics.map((t) => {
          const cards = flashcardsByTopic(t.id);
          if (cards.length === 0) return null;
          const k = cards.filter((c) => progress.cards[c.id] === "known").length;
          const c = colorClasses[t.color];
          return (
            <li key={t.id}>
              <Link to={`/karteikarten/${t.id}`} className="card flex items-center gap-3 transition active:scale-[0.99]">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${c.soft}`}>
                  {t.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate font-bold text-slate-900">{t.title}</h3>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
                      {k}/{cards.length}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={k / cards.length} barClass={c.bar} heightClass="h-2" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ----------------------------- Lern-Sitzung ------------------------- */

export function FlashcardsPage() {
  const { topicId = "alle" } = useParams();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const pool = topicId === "alle" ? flashcards : flashcardsByTopic(topicId);
  const unknownCount = pool.filter((c) => progress.cards[c.id] !== "known").length;
  const [round, setRound] = useState(0);
  const [includeKnown, setIncludeKnown] = useState(false);
  const [started, setStarted] = useState(unknownCount > 0);

  if (pool.length === 0) {
    return (
      <div className="card mt-6 text-center">
        <p>Zu diesem Thema gibt es noch keine Karteikarten.</p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => navigate("/karteikarten")}>
          Zurück
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="animate-slide-up pt-10 text-center">
        <div className="text-6xl">🌟</div>
        <h1 className="mt-3 text-2xl font-extrabold">Alle Karten gekonnt!</h1>
        <p className="mt-1 text-slate-600">Du kannst alle {pool.length} Karten. Willst du sie trotzdem auffrischen?</p>
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setIncludeKnown(true);
              setStarted(true);
            }}
          >
            Alle Karten nochmal üben
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/karteikarten")}>
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <FlashcardRound
      key={`${round}-${includeKnown}`}
      topicId={topicId}
      includeKnown={includeKnown}
      onRestart={(all) => {
        setIncludeKnown(all);
        setRound((r) => r + 1);
      }}
    />
  );
}

function FlashcardRound({
  topicId,
  includeKnown,
  onRestart,
}: {
  topicId: string;
  includeKnown: boolean;
  onRestart: (includeKnown: boolean) => void;
}) {
  const navigate = useNavigate();
  const { progress, rateCard } = useProgress();
  const [queue, setQueue] = useState<Flashcard[]>(() => {
    const pool = topicId === "alle" ? flashcards : flashcardsByTopic(topicId);
    const deck = includeKnown ? pool : pool.filter((c) => progress.cards[c.id] !== "known");
    return shuffle(deck);
  });
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [xp, setXp] = useState(0);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [unknownIds, setUnknownIds] = useState<string[]>([]);
  const [requeued, setRequeued] = useState<Record<string, number>>({});
  const topic = topicById(topicId);
  const title = `Karteikarten · ${topic ? topic.title : "Alle Themen"}`;

  const card = queue[idx];

  if (!card) {
    return (
      <div className="animate-slide-up pt-6 text-center">
        <div className="text-6xl">{unknownIds.length === 0 ? "🏆" : "👍"}</div>
        <h1 className="mt-3 text-2xl font-extrabold">Stapel geschafft!</h1>
        <p className="mt-1 text-slate-600">
          ✅ {knownIds.length} gekonnt · ❌ {new Set(unknownIds).size} noch unsicher ·{" "}
          <span className="font-bold text-indigo-700">+{xp} XP</span>
        </p>
        <div className="mt-6 grid gap-3">
          <button type="button" className="btn btn-primary" onClick={() => onRestart(false)}>
            🔁 Nur unsichere Karten üben
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onRestart(true)}>
            Alle Karten nochmal
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/karteikarten")}>
            Fertig
          </button>
        </div>
      </div>
    );
  }

  function rate(known: boolean) {
    const gained = rateCard(card.id, known);
    setXp((x) => x + gained);
    if (known) {
      setKnownIds((k) => [...k, card.id]);
    } else {
      setUnknownIds((u) => [...u, card.id]);
      // Unsichere Karten kommen in dieser Runde noch bis zu zweimal wieder.
      if ((requeued[card.id] ?? 0) < 2) {
        setRequeued((r) => ({ ...r, [card.id]: (r[card.id] ?? 0) + 1 }));
        setQueue((q) => [...q, card]);
      }
    }
    setFlipped(false);
    setIdx(idx + 1);
  }

  const cardTopic = topicById(card.topic);

  return (
    <div>
      <SessionHeader title={title} index={idx} total={queue.length} onExit={() => navigate("/karteikarten")} />

      <div className="flip-scene animate-slide-up">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Karte zurückdrehen" : "Karte umdrehen"}
          className={`flip-card grid w-full text-left ${flipped ? "flipped" : ""}`}
        >
          <div className="flip-face card col-start-1 row-start-1 flex min-h-72 flex-col items-center justify-center text-center">
            {cardTopic && (
              <span className="chip mb-4 bg-slate-100 text-slate-600">
                {cardTopic.icon} {cardTopic.title}
              </span>
            )}
            <span className="text-3xl font-extrabold leading-tight text-slate-900">{card.term}</span>
            <span className="mt-6 text-sm text-slate-400">Tippen zum Umdrehen ↻</span>
          </div>
          <div className="flip-face flip-back card col-start-1 row-start-1 flex min-h-72 flex-col justify-center bg-indigo-50 ring-indigo-200">
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">{card.term}</span>
            <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-900">{card.definition}</p>
            {card.example && (
              <p className="mt-3 rounded-lg bg-white p-2.5 text-sm text-slate-700">
                <strong>Beispiel:</strong> {card.example}
              </p>
            )}
          </div>
        </button>
      </div>

      <div className="mt-5">
        {flipped ? (
          <div className="grid animate-slide-up grid-cols-2 gap-3">
            <button type="button" className="btn btn-danger" onClick={() => rate(false)}>
              ❌ Kann ich nicht
            </button>
            <button type="button" className="btn btn-success" onClick={() => rate(true)}>
              ✅ Kann ich
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500">
            Überlege zuerst kurz, wie du den Begriff erklären würdest. Dann dreh die Karte um.
          </p>
        )}
      </div>
    </div>
  );
}
