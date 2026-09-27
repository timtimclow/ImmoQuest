import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionRunner } from "../components/SessionRunner";
import { useProgress } from "../lib/progress";
import { buildReviewSession } from "../lib/sessions";

/** Wiederholungsmodus: falsch beantwortete Fragen kommen hier wieder. Richtig → raus aus der Liste. */
export function ReviewPage() {
  const [round, setRound] = useState(0);
  return <ReviewRound key={round} onRestart={() => setRound((r) => r + 1)} />;
}

function ReviewRound({ onRestart }: { onRestart: () => void }) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [questions] = useState(() => buildReviewSession(progress));
  const remaining = progress.review.length;

  return (
    <SessionRunner
      title="Wiederholen"
      questions={questions}
      mode="review"
      onExit={() => navigate("/")}
      onRestart={remaining > 0 ? onRestart : undefined}
      restartLabel={`Weiter wiederholen (${remaining} offen)`}
      emptyState={
        <>
          <div className="text-5xl">🎉</div>
          <h1 className="mt-2 text-xl font-extrabold">Nichts zu wiederholen!</h1>
          <p className="mt-1 text-slate-600">
            Sobald du eine Frage falsch beantwortest, landet sie hier – bis du sie richtig kannst.
          </p>
        </>
      }
    />
  );
}
