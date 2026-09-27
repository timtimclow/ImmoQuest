import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  // GitHub Pages liefert die App unter https://<user>.github.io/ImmoQuest/ aus –
  // deshalb beim Bauen einen Unterpfad verwenden. Lokal (npm run dev) bleibt es die Wurzel "/".
  base: command === "build" ? "/ImmoQuest/" : "/",
  // Alle Lerninhalte stecken direkt im Bundle – für eine lokale Lern-App ist das völlig in Ordnung.
  build: { chunkSizeWarningLimit: 1000 },
}));
