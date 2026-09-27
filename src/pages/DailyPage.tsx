import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionRunner } from "../components/SessionRunner";
import { dayKey } from "../lib/date";
import { useProgress } from "../lib/progress";
import { buildDailySession } from "../lib/sessions";

/** Tages-Challenge: 5 gemischte Fragen, jeden Tag dieselben (Seed = Datum). */
export function DailyPage() {
  const navigate = useNavigate();
  const { progress, completeDaily } = useProgress();
  const today = dayKey();
  const done = progress.daily[today];
  const [started, setStarted] = useState(!done);
  const [round, setRound] = useState(0);
  const [questions] = useState(() => buildDailySession(today));

  if (!started) {
    return (
      <div className="animate-slide-up pt-10 text-center">
        <div className="text-6xl">✅</div>
        <h1 className="mt-3 text-2xl font-extrabold">Heute schon geschafft!</h1>
        <p className="mt-1 text-slate-600">
          Ergebnis: {done!.score} von {done!.total} richtig. Morgen warten 5 neue Fragen auf dich.
        </p>
        <div className="mt-6 grid gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
            Trotzdem nochmal üben (ohne Bonus)
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <SessionRunner
      key={round}
      title="Tages-Challenge"
      questions={questions}
      mode="daily"
      onExit={() => navigate("/")}
      onRestart={() => setRound((r) => r + 1)}
      restartLabel="Nochmal üben"
      onFinished={(score, total) => completeDaily(today, score, total)}
    />
  );
}
