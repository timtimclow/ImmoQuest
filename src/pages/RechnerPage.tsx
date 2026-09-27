import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { LEGAL, LEGAL_STAND } from "../data/legal";

/** "300.000", "300000", "5,5" oder "3.5" → Zahl. Ungültig → 0. */
function parseNum(s: string): number {
  let t = s.trim().replace(/[€%\s]/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const pct = (n: number) => `${n.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`;

function Field({
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="flex items-center rounded-xl border-2 border-slate-200 bg-white focus-within:border-indigo-500">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-transparent px-3 py-3 text-lg font-semibold text-slate-900 outline-none"
        />
        {suffix && <span className="pr-3 font-semibold text-slate-400">{suffix}</span>}
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function Row({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-2 ${strong ? "text-lg font-extrabold text-slate-900" : "text-slate-800"}`}>
      <div>
        <div className={strong ? "" : "font-medium"}>{label}</div>
        {sub && <div className="text-xs font-normal text-slate-500">{sub}</div>}
      </div>
      <div className="tabular-nums">{value}</div>
    </div>
  );
}

/**
 * Kaufnebenkosten- und Budget-Rechner.
 * Die Standardwerte stammen aus src/data/legal.ts (mit Stand-Angabe) und lassen sich hier anpassen.
 */
export function RechnerPage() {
  const [price, setPrice] = useState("300000");
  const [withBroker, setWithBroker] = useState(true);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [grest, setGrest] = useState(String(LEGAL.grunderwerbsteuerNiedersachsen).replace(".", ","));
  const [notar, setNotar] = useState(String(LEGAL.notarProzent).replace(".", ","));
  const [grundbuch, setGrundbuch] = useState(String(LEGAL.grundbuchProzent).replace(".", ","));
  const [makler, setMakler] = useState(String(LEGAL.maklerKaeuferProzent).replace(".", ","));

  const [equity, setEquity] = useState("60000");
  const [zins, setZins] = useState("3,5");
  const [tilgung, setTilgung] = useState("2");
  const [laufend, setLaufend] = useState("300");
  const [netto, setNetto] = useState("4500");

  const p = parseNum(price);
  const costs = {
    grest: (p * parseNum(grest)) / 100,
    notar: (p * parseNum(notar)) / 100,
    grundbuch: (p * parseNum(grundbuch)) / 100,
    makler: withBroker ? (p * parseNum(makler)) / 100 : 0,
  };
  const nebenkosten = costs.grest + costs.notar + costs.grundbuch + costs.makler;
  const gesamt = p + nebenkosten;
  const nkQuote = p > 0 ? (nebenkosten / p) * 100 : 0;

  const ek = parseNum(equity);
  const darlehen = Math.max(0, gesamt - ek);
  const jahresrate = (darlehen * (parseNum(zins) + parseNum(tilgung))) / 100;
  const monatsrate = jahresrate / 12;
  const belastung = monatsrate + parseNum(laufend);
  const nettoEinkommen = parseNum(netto);
  const belastungQuote = nettoEinkommen > 0 ? (belastung / nettoEinkommen) * 100 : null;
  const ekQuote = p > 0 ? (ek / p) * 100 : 0;

  const warnings: string[] = [];
  if (p > 0 && ek < nebenkosten) {
    warnings.push(
      `Dein Eigenkapital deckt nicht einmal die Kaufnebenkosten (${eur.format(nebenkosten)}). Banken finanzieren Nebenkosten ungern mit.`,
    );
  } else if (p > 0 && ekQuote < 10 + nkQuote) {
    warnings.push("Mit wenig Eigenkapital wird der Zins meist höher. Als Faustregel: Nebenkosten plus 10–20 % des Kaufpreises.");
  }
  if (belastungQuote !== null && belastungQuote > 40) {
    warnings.push("Die monatliche Belastung liegt über etwa 40 % des Nettoeinkommens. Das ist als Faustregel zu hoch und lässt kaum Puffer.");
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kaufnebenkosten & Budget"
        icon="🧮"
        backTo="/kaufen"
        subtitle="Gib den Kaufpreis ein und sieh, was zusätzlich zum Preis auf dich zukommt."
      />

      {/* 1. Kaufpreis */}
      <section className="card space-y-3">
        <Field label="Kaufpreis" value={price} onChange={setPrice} suffix="€" />
        <div className="flex flex-wrap gap-2">
          {[200000, 300000, 400000, 500000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setPrice(String(v))}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 active:bg-slate-200"
            >
              {eur.format(v)}
            </button>
          ))}
        </div>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-700">
            Mit Makler (Käuferanteil {String(makler)} %)
          </span>
          <input
            type="checkbox"
            checked={withBroker}
            onChange={(e) => setWithBroker(e.target.checked)}
            className="h-6 w-6 accent-indigo-600"
          />
        </label>
        <button
          type="button"
          className="text-sm font-semibold text-indigo-700 underline"
          onClick={() => setShowAssumptions((s) => !s)}
        >
          {showAssumptions ? "Annahmen ausblenden" : "Annahmen ansehen und ändern"}
        </button>
        {showAssumptions && (
          <div className="grid grid-cols-2 gap-3 animate-slide-up">
            <Field label="Grunderwerbsteuer" value={grest} onChange={setGrest} suffix="%" />
            <Field label="Notar" value={notar} onChange={setNotar} suffix="%" />
            <Field label="Grundbuch" value={grundbuch} onChange={setGrundbuch} suffix="%" />
            <Field label="Käuferprovision" value={makler} onChange={setMakler} suffix="%" />
          </div>
        )}
      </section>

      {/* 2. Ergebnis Nebenkosten */}
      <section className="card divide-y divide-slate-100">
        <h2 className="pb-2 font-bold text-slate-900">Kaufnebenkosten im Einzelnen</h2>
        <Row
          label="Grunderwerbsteuer"
          sub={`${grest} % vom Kaufpreis (Niedersachsen)`}
          value={eur.format(costs.grest)}
        />
        <Row label="Notarkosten" sub={`ca. ${notar} % – Beurkundung, Betreuung, Vollzug`} value={eur.format(costs.notar)} />
        <Row label="Grundbuchkosten" sub={`ca. ${grundbuch} % – Vormerkung, Eigentumsumschreibung`} value={eur.format(costs.grundbuch)} />
        <Row
          label="Maklerprovision (Käufer)"
          sub={withBroker ? `${makler} % inkl. MwSt. – Hälfte der Gesamtprovision` : "Kein Makler"}
          value={eur.format(costs.makler)}
        />
        <Row label="Kaufnebenkosten gesamt" sub={`${pct(nkQuote)} des Kaufpreises`} value={eur.format(nebenkosten)} strong />
        <Row label="Gesamtkosten (Preis + Nebenkosten)" value={eur.format(gesamt)} strong />
      </section>

      {/* 3. Finanzierung */}
      <section className="card space-y-3">
        <h2 className="font-bold text-slate-900">Und die monatliche Belastung?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Eigenkapital" value={equity} onChange={setEquity} suffix="€" />
          <Field label="Netto-Einkommen (Haushalt)" value={netto} onChange={setNetto} suffix="€" hint="pro Monat, optional" />
          <Field label="Zins" value={zins} onChange={setZins} suffix="%" />
          <Field label="Anfangstilgung" value={tilgung} onChange={setTilgung} suffix="%" />
        </div>
        <Field
          label="Laufende Kosten pro Monat"
          value={laufend}
          onChange={setLaufend}
          suffix="€"
          hint="z. B. Hausgeld oder Nebenkosten, Grundsteuer, Rücklage für Reparaturen"
        />
      </section>

      <section className="card divide-y divide-slate-100">
        <Row label="Darlehen" sub="Gesamtkosten minus Eigenkapital" value={eur.format(darlehen)} />
        <Row label="Monatliche Kreditrate" sub={`${zins} % Zins + ${tilgung} % Tilgung, ÷ 12`} value={eur2.format(monatsrate)} />
        <Row label="Laufende Kosten" value={eur2.format(parseNum(laufend))} />
        <Row label="Monatliche Belastung gesamt" value={eur2.format(belastung)} strong />
        {belastungQuote !== null && (
          <Row label="Anteil am Netto-Einkommen" sub="Faustregel: höchstens ca. 35–40 %" value={pct(belastungQuote)} />
        )}
        <Row label="Eigenkapital-Quote" sub="Eigenkapital ÷ Kaufpreis" value={pct(ekQuote)} />
      </section>

      {warnings.length > 0 && (
        <ul className="space-y-2">
          {warnings.map((w) => (
            <li key={w} className="rounded-xl bg-rose-50 p-3 text-sm leading-snug text-rose-900 ring-1 ring-rose-200">
              ⚠️ {w}
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
        📅 {LEGAL_STAND}. Notar- und Grundbuchkosten sind Faustwerte (echte Gebühren richten sich nach dem
        Gerichts- und Notarkostengesetz). Die Provision ist nicht gesetzlich festgelegt. Das Ergebnis ersetzt
        keine Bankberechnung.
      </p>
    </div>
  );
}
