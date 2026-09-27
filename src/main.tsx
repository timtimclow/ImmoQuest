import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ProgressProvider } from "./lib/progress";
import "./index.css";

// HashRouter: Die App läuft auch dann sauber, wenn du die gebaute Version einfach
// auf einen beliebigen Webspace legst (keine Server-Einstellungen nötig).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProgressProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ProgressProvider>
  </StrictMode>,
);
