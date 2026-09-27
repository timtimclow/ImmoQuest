import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionRunner } from "../components/SessionRunner";
import { topicById } from "../lib/content";
import { useProgress } from "../lib/progress";
import { buildTopicSession } from "../lib/sessions";

/** Quiz zu einem Thema (oder "alle" = gemischt). Neue Runde = neuer key → neue Fragenauswahl. */
export function QuizPage() {
  const { topicId = "alle" } = useParams();
  const [round, setRound] = useState(0);
  return <QuizRound key={round} topicId={topicId} onRestart={() => setRound((r) => r + 1)} />;
}

function QuizRound({ topicId, onRestart }: { topicId: string; onRestart: () => void }) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  // Nur einmal beim Start der Runde auswählen (nicht bei jeder Fortschritts-Änderung neu).
  const [questions] = useState(() => buildTopicSession(topicId, progress));
  const topic = topicById(topicId);

  return (
    <SessionRunner
      title={`Quiz · ${topic ? topic.title : "Alle Themen"}`}
      questions={questions}
      mode="quiz"
      onExit={() => navigate(topic ? `/thema/${topic.id}` : "/spielen")}
      onRestart={onRestart}
      restartLabel="Nächste Runde"
    />
  );
}
