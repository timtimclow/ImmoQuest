import { Navigate, Route, Routes } from "react-router-dom";
import { FocusLayout, MainLayout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Play } from "./pages/Play";
import { TopicPage } from "./pages/TopicPage";
import { QuizPage } from "./pages/QuizPage";
import { ReviewPage } from "./pages/ReviewPage";
import { DailyPage } from "./pages/DailyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { BaujahrGame, BaujahrIntro, EpochGallery } from "./pages/BaujahrPages";
import { FlashcardsMenu, FlashcardsPage } from "./pages/FlashcardPages";
import { CalcMenu, CalcPage } from "./pages/CalcPages";
import { SimulationGame, SimulationIntro } from "./pages/SimulationPages";
import { KaufprozessPage } from "./pages/KaufprozessPage";
import { RechnerPage } from "./pages/RechnerPage";

export default function App() {
  return (
    <Routes>
      {/* Seiten mit Kopfzeile und Navigation */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/spielen" element={<Play />} />
        <Route path="/kaufen" element={<KaufprozessPage />} />
        <Route path="/rechner" element={<RechnerPage />} />
        <Route path="/thema/:id" element={<TopicPage />} />
        <Route path="/baujahr" element={<BaujahrIntro />} />
        <Route path="/baujahr/epochen" element={<EpochGallery />} />
        <Route path="/karteikarten" element={<FlashcardsMenu />} />
        <Route path="/rechnen" element={<CalcMenu />} />
        <Route path="/simulation" element={<SimulationIntro />} />
        <Route path="/profil" element={<ProfilePage />} />
      </Route>

      {/* Lern-Sitzungen ohne Ablenkung */}
      <Route element={<FocusLayout />}>
        <Route path="/quiz/:topicId" element={<QuizPage />} />
        <Route path="/wiederholen" element={<ReviewPage />} />
        <Route path="/tages-challenge" element={<DailyPage />} />
        <Route path="/baujahr/spiel" element={<BaujahrGame />} />
        <Route path="/karteikarten/:topicId" element={<FlashcardsPage />} />
        <Route path="/rechnen/:category" element={<CalcPage />} />
        <Route path="/simulation/spiel" element={<SimulationGame />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
