import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  // Alle Lerninhalte stecken direkt im Bundle – für eine lokale Lern-App ist das völlig in Ordnung.
  build: { chunkSizeWarningLimit: 1000 },
});
