import type { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";

interface Props {
  title: string;
  /** Nummer der aktuellen Aufgabe (ab 0). */
  index: number;
  total: number;
  onExit: () => void;
  extra?: ReactNode;
}

/** Kopfzeile aller Lern-Sitzungen: Beenden-Knopf, Fortschritt, Zähler. */
export function SessionHeader({ title, index, total, onExit, extra }: Props) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 bg-slate-50/95 px-4 pt-3 pb-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          aria-label="Beenden"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-slate-500 ring-1 ring-slate-200"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={index / total} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-slate-500">
          {index + 1}/{total}
        </span>
      </div>
      <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      {extra}
    </div>
  );
}
