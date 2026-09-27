/**
 * Prüft alle Lerninhalte in src/data auf typische Fehler.
 * Aufruf:  npm run check-data
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const topics = read("topics.json");
const topicIds = new Set(topics.map((t) => t.id));
const ids = new Set();

/* Mindestanzahl Fragen pro Thema (laut Anforderung). */
const MIN_QUESTIONS = { kaufen: 40, rechnen: 15 };
const DEFAULT_MIN = 15;

function checkQuestion(q, where, { needSteps = false, needScenario = false } = {}) {
  const at = `${where} ${q.id ?? "(ohne id)"}`;
  if (!q.id) err(`${at}: id fehlt`);
  else if (ids.has(q.id)) err(`${at}: id doppelt vergeben`);
  else ids.add(q.id);

  if (![1, 2, 3].includes(q.difficulty)) err(`${at}: difficulty muss 1, 2 oder 3 sein`);
  for (const f of ["question", "explanation", "practiceTip"]) {
    if (typeof q[f] !== "string" || q[f].trim().length < 5) err(`${at}: Feld "${f}" fehlt oder ist zu kurz`);
  }
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
    err(`${at}: options braucht 2–6 Einträge`);
    return;
  }
  if (new Set(q.options).size !== q.options.length) err(`${at}: doppelte Antwortmöglichkeiten`);
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
    err(`${at}: correctAnswer (${q.correctAnswer}) liegt außerhalb der Antworten`);
    return;
  }
  if (!Array.isArray(q.wrongExplanations) || q.wrongExplanations.length !== q.options.length) {
    err(`${at}: wrongExplanations muss genau so lang sein wie options (${q.options.length})`);
    return;
  }
  q.wrongExplanations.forEach((w, i) => {
    if (i === q.correctAnswer) {
      if (w !== null) err(`${at}: wrongExplanations[${i}] gehört zur richtigen Antwort und muss null sein`);
    } else if (typeof w !== "string" || w.trim().length < 5) {
      err(`${at}: wrongExplanations[${i}] fehlt`);
    }
  });
  // Antworten werden gemischt – Text darf deshalb nicht auf Buchstaben verweisen.
  const all = [q.question, q.explanation, q.practiceTip, ...q.options, ...q.wrongExplanations.filter(Boolean)].join(" ");
  if (/\b(Antwort|Option|Variante)\s+[A-D]\b/.test(all)) err(`${at}: Verweis auf Antwort-Buchstaben (Antworten werden gemischt!)`);
  if (needSteps && (!Array.isArray(q.steps) || q.steps.length < 2)) err(`${at}: Rechenaufgabe braucht "steps" (Rechenweg)`);
  if (needScenario && (typeof q.scenario !== "string" || q.scenario.length < 10)) err(`${at}: Simulation braucht "scenario"`);
}

/* ------------------------------ Fragen ------------------------------ */
const counts = {};
for (const f of readdirSync(join(root, "questions")).filter((n) => n.endsWith(".json"))) {
  const file = read(`questions/${f}`);
  if (!topicIds.has(file.topic)) err(`questions/${f}: topic "${file.topic}" steht nicht in topics.json`);
  if (`${file.topic}.json` !== f) warn(`questions/${f}: Dateiname sollte "${file.topic}.json" heißen`);
  counts[file.topic] = file.questions.length;
  for (const q of file.questions) checkQuestion(q, `questions/${f}`, { needSteps: file.topic === "rechnen" });
}
for (const t of topics) {
  const min = MIN_QUESTIONS[t.id] ?? DEFAULT_MIN;
  if ((counts[t.id] ?? 0) < min) err(`Thema "${t.id}" hat ${counts[t.id] ?? 0} Fragen, gefordert sind mindestens ${min}`);
}

/* ---------------------------- Karteikarten -------------------------- */
const cards = read("flashcards.json");
const cardIds = new Set();
for (const c of cards) {
  if (!c.id || cardIds.has(c.id)) err(`flashcards: id fehlt oder doppelt (${c.id})`);
  cardIds.add(c.id);
  if (!topicIds.has(c.topic)) err(`flashcards ${c.id}: unbekanntes Thema "${c.topic}"`);
  if (!c.term || !c.definition) err(`flashcards ${c.id}: term/definition fehlt`);
}

/* ------------------------------ Epochen ----------------------------- */
const epochs = read("epochs.json");
const epochIds = new Set(epochs.map((e) => e.id));
for (const e of epochs) {
  for (const f of ["name", "zeitraum", "signature"]) if (!e[f]) err(`epochs ${e.id}: "${f}" fehlt`);
  if (!Array.isArray(e.hinweise) || e.hinweise.length < 2) err(`epochs ${e.id}: mindestens 2 Hinweise`);
  if (!Array.isArray(e.merkmale) || e.merkmale.length < 3) err(`epochs ${e.id}: mindestens 3 Merkmale`);
  for (const m of e.merkmale ?? []) {
    if (!(m.x >= 0 && m.x <= 400 && m.y >= 0 && m.y <= 260)) err(`epochs ${e.id}: Marker außerhalb der Zeichnung (${m.x}/${m.y})`);
  }
  if (!Array.isArray(e.verkauf) || e.verkauf.length < 2) err(`epochs ${e.id}: mindestens 2 Verkaufshinweise`);
  for (const k of Object.keys(e.verwechslung ?? {})) if (!epochIds.has(k)) err(`epochs ${e.id}: verwechslung verweist auf unbekannte Epoche "${k}"`);
  if (e.photo && !(e.photo.src && e.photo.license && e.photo.author && e.photo.sourceUrl)) err(`epochs ${e.id}: photo braucht src, author, license und sourceUrl`);
}
if (epochs.length !== 8) warn(`epochs: ${epochs.length} Epochen (erwartet: 8)`);

/* ----------------------------- Simulation --------------------------- */
const sim = read("simulation.json");
for (const s of sim.stationen) {
  checkQuestion(s, "simulation", { needScenario: true });
  if (!s.station || !s.icon) err(`simulation ${s.id}: station/icon fehlt`);
}

/* ---------------------------- Kaufprozess --------------------------- */
const kp = read("kaufprozess.json");
if (kp.steps.length !== 14) err(`kaufprozess: ${kp.steps.length} Schritte, erwartet 14`);
kp.steps.forEach((s, i) => {
  if (s.nr !== i + 1) err(`kaufprozess: Schritt ${i + 1} hat nr ${s.nr}`);
  if (!s.titel || !s.kurz || !s.tipp || !Array.isArray(s.details) || s.details.length < 1) err(`kaufprozess: Schritt ${s.nr} unvollständig`);
});

/* ------------------------------ Ergebnis ---------------------------- */
console.log("\nFragen pro Thema:");
for (const t of topics) console.log(`  ${t.id.padEnd(15)} ${String(counts[t.id] ?? 0).padStart(3)}`);
console.log(`\nKarteikarten: ${cards.length} · Epochen: ${epochs.length} · Simulations-Stationen: ${sim.stationen.length} · Kaufprozess-Schritte: ${kp.steps.length}`);
for (const w of warnings) console.log(`⚠️  ${w}`);
if (errors.length) {
  console.log(`\n❌ ${errors.length} Fehler:`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log("\n✅ Alle Inhalte sind in Ordnung.");
