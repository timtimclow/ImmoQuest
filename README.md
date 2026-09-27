# ImmoQuest 🏠

Lern-App für die Vorbereitung auf die Ausbildung zum Immobilienkaufmann (Niedersachsen).
Mobile first, läuft lokal im Browser, Fortschritt bleibt im `localStorage` deines Browsers.

## App starten

Voraussetzung: [Node.js](https://nodejs.org) (LTS) ist installiert.

```bash
npm install        # nur beim ersten Mal
npm run dev        # startet die App auf http://localhost:5173
```

**Am Handy testen** (Handy und PC im selben WLAN):

```bash
npm run dev:phone
```

Im Terminal erscheint eine Adresse wie `http://192.168.x.x:5173` ("Network"). Die öffnest du am Handy.
Beim ersten Mal fragt die Windows-Firewall evtl. nach – „Zugriff zulassen“ für private Netzwerke.

**Fertige Version bauen:**

```bash
npm run build      # prüft Typen und baut nach dist/
npm run preview    # startet die gebaute Version zum Ausprobieren
```

Den Ordner `dist/` kannst du auf jeden Webspace legen (die App nutzt Hash-Adressen, es ist keine Server-Einstellung nötig).

## Was steckt drin?

| Bereich | Inhalt |
| --- | --- |
| Quiz | Multiple Choice mit Erklärung nach **jeder** Antwort |
| Baujahr-Raten | 8 Bauepochen als eigene SVG-Zeichnungen, mit Merkmalen und Verkaufs-Hinweisen |
| Karteikarten | Fachbegriffe: „Kann ich“ / „Kann ich nicht“ |
| Rechen-Challenges | Nebenkosten, Grunderwerbsteuer, Rendite, Warmmiete, Annuität – mit Rechenweg |
| Kaufprozess-Simulation | 14 Stationen mit Familie Krause, vom Budget bis zur Eintragung |
| Tages-Challenge | 5 gemischte Fragen pro Tag (immer dieselben am selben Tag) |
| Lernseite „Kaufprozess von A bis Z“ | Zeitstrahl, Besichtigungs-Checkliste, Unterlagen, Kosten, Vergleiche, typische Fehler |
| Kaufnebenkosten-Rechner | Kaufpreis eingeben, Nebenkosten + monatliche Belastung sehen |
| Gamification | XP, Level („Praktikant“ → „Azubi“ → „Makler“ → „Immobilienfachwirt“), Streak, Fortschritt je Thema, Wiederholungsmodus |

## Ordnerstruktur

```
src/
  data/                     ← ALLE Lerninhalte (hier ergänzt du Neues)
    questions/*.json        ← Fragen je Thema (eine Datei pro Thema)
    topics.json             ← Themenliste (Titel, Icon, Farbe)
    flashcards.json         ← Karteikarten
    epochs.json             ← Bauepochen fürs Baujahr-Raten
    simulation.json         ← Kaufprozess-Simulation
    kaufprozess.json        ← Lernseite „Kaufprozess von A bis Z“
    rechnen-kategorien.json ← Kategorien der Rechen-Challenges
    levels.json             ← Level-Titel und XP-Schwellen
    legal.ts                ← rechtliche Zahlen mit „Stand“ (Steuersatz, Provision, Fristen)
  illustrations/Houses.tsx  ← die 8 SVG-Zeichnungen
  components/, pages/, lib/ ← Programmcode
scripts/check-data.mjs      ← Prüfskript für die Inhalte
public/images/epochs/       ← Platz für eigene Fotos
```

## Neue Fragen ergänzen

Öffne die passende Datei in `src/data/questions/` (z. B. `makler.json`) und füge ein Objekt zu `"questions"` hinzu:

```json
{
  "id": "mk-17",
  "difficulty": 2,
  "question": "Deine Frage?",
  "options": ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
  "correctAnswer": 1,
  "explanation": "Warum ist die richtige Antwort richtig? (2–4 Sätze, einfach erklärt)",
  "wrongExplanations": [
    "Warum Antwort A falsch ist.",
    null,
    "Warum Antwort C falsch ist.",
    "Warum Antwort D falsch ist."
  ],
  "practiceTip": "Ein Praxis-Tipp oder Beispiel aus dem Makler-Alltag."
}
```

Regeln:

- `id` muss einmalig sein (Kürzel des Themas + Nummer).
- `difficulty`: 1 = leicht, 2 = mittel, 3 = schwer.
- `correctAnswer` ist die **Nummer** der richtigen Antwort, gezählt ab **0**.
- `wrongExplanations` hat genauso viele Einträge wie `options`. An der Stelle der richtigen Antwort steht `null`.
- Die Antworten werden beim Anzeigen **gemischt**. Schreib deshalb nie „Antwort A“ oder „siehe oben“ in einen Text.
- Optional: `"stand": "Stand 2025"` (wird als Hinweis angezeigt), `"fixedOrder": true` (Antworten nicht mischen).
- Rechenaufgaben (`rechnen.json`) brauchen zusätzlich `"steps"` (der Rechenweg, ein Schritt pro Eintrag) und `"category"`.

Danach kurz prüfen:

```bash
npm run check-data
```

Das Skript meldet vergessene Felder, falsche Nummern, doppelte IDs und Ähnliches.

**Neues Thema:** Eintrag in `topics.json` anlegen und eine Datei `src/data/questions/<topic-id>.json` mit `{ "topic": "<topic-id>", "questions": [ … ] }` erstellen. Sie wird automatisch geladen.

## Bilder: eigene Fotos statt Zeichnung

Alle Häuser sind selbst gezeichnete SVGs (`src/illustrations/Houses.tsx`) – keine urheberrechtlich geschützten Fotos.
Willst du für eine Epoche ein echtes Foto zeigen, zum Beispiel von [Wikimedia Commons](https://commons.wikimedia.org):

1. Foto mit **freier Lizenz** wählen (CC0, CC BY, CC BY-SA …), Datei in `public/images/epochs/` speichern.
2. In `src/data/epochs.json` bei der Epoche `"photo"` ausfüllen:

```json
"photo": {
  "src": "/images/epochs/gruenderzeit.jpg",
  "alt": "Gründerzeit-Mietshaus mit Stuckfassade",
  "author": "Name des Fotografen",
  "license": "CC BY-SA 4.0",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:…"
}
```

Urheber, Lizenz und Quellenlink werden dann automatisch unter dem Bild angezeigt. Beachte die Lizenzbedingungen (z. B. Namensnennung, Weitergabe unter gleichen Bedingungen bei CC BY-SA). Mehr dazu steht in `public/images/epochs/README.md`.

## Rechtliche Zahlen (mit „Stand“)

Steuersätze, Provisionsregeln und Fristen ändern sich. Deshalb:

- Zentrale Werte stehen mit „Stand“ und Kommentaren in `src/data/legal.ts` (Rechner und Anzeigen nutzen sie).
- Jede Fragen-Datei hat ein Feld `"stand"` und einen `"hinweis"`.
- Die Fragentexte nennen dieselben Zahlen (z. B. „5 %“, „3,57 %“). Ändert sich ein Wert, suche nach dem alten Wert in `src/data`.

Bitte vor Prüfungen und im Berufsalltag immer gegen die aktuelle Rechtslage prüfen. ImmoQuest ersetzt keine Rechts- oder Steuerberatung.

## Fortschritt

Gespeichert im `localStorage` unter dem Schlüssel `immoquest.progress.v1` (XP, Level, Streak, beantwortete Fragen, Wiederholungsliste, Karteikarten, Checklisten).
Unter **Profil** kannst du den Fortschritt exportieren, auf einem anderen Gerät importieren oder zurücksetzen.

## Technik

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router (Hash-Adressen). Keine weiteren Bibliotheken, kein Server nötig.
