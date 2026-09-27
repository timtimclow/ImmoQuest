import type { Epoch } from "../types";
import { illustrations } from "../illustrations/Houses";

interface Props {
  epoch: Epoch;
  /** Nummerierte Marker für die Erkennungsmerkmale einblenden (nur bei der SVG-Illustration). */
  showMarkers?: boolean;
  /**
   * "auto"  = Foto, falls in epochs.json hinterlegt, sonst Zeichnung (Standard, z. B. im Quiz)
   * "photo" = nur das Foto (wird nichts angezeigt, wenn keins hinterlegt ist)
   * "svg"   = immer die selbst gezeichnete Illustration (z. B. für die Erklärung mit Markern)
   */
  mode?: "auto" | "photo" | "svg";
}

/**
 * Zeigt die Epoche als Foto (falls in src/data/epochs.json unter "photo" eingetragen,
 * inkl. Lizenzangabe) oder als selbst gezeichnete SVG-Illustration.
 *
 * Eigenes Foto einbinden: Datei nach public/images/epochs/ legen und in
 * src/data/epochs.json bei der Epoche "photo" ausfüllen (siehe README).
 */
export function EpochImage({ epoch, showMarkers = false, mode = "auto" }: Props) {
  if (epoch.photo && mode !== "svg") {
    const p = epoch.photo;
    return (
      <figure className="overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
        <img
          src={p.src}
          alt={p.alt}
          className="mx-auto block max-h-80 w-full object-contain"
          loading="lazy"
        />
        <figcaption className="bg-white px-3 py-1.5 text-[0.7rem] leading-snug text-slate-500">
          Foto: {p.author} · {p.license} ·{" "}
          <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="underline">
            Quelle (Wikimedia Commons)
          </a>
        </figcaption>
      </figure>
    );
  }
  if (mode === "photo") return null;

  const Illustration = illustrations[epoch.id];
  if (!Illustration) {
    return (
      <div className="flex aspect-[400/260] items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        Kein Bild hinterlegt
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
      <svg viewBox="0 0 400 260" role="img" aria-label={`Zeichnung eines Hauses: ${epoch.name}`} className="block w-full">
        <Illustration />
        {showMarkers &&
          epoch.merkmale.map((m, i) => (
            <g key={i}>
              <circle cx={m.x} cy={m.y} r="11" fill="#4338ca" stroke="#fff" strokeWidth="2.5" />
              <text x={m.x} y={m.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">
                {i + 1}
              </text>
            </g>
          ))}
      </svg>
      <figcaption className="bg-white px-3 py-1.5 text-[0.7rem] text-slate-400">
        Selbst gezeichnete Illustration – kein Foto
      </figcaption>
    </figure>
  );
}
