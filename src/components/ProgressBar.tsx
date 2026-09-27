interface Props {
  /** 0–1 */
  value: number;
  barClass?: string;
  trackClass?: string;
  heightClass?: string;
  label?: string;
}

export function ProgressBar({
  value,
  barClass = "bg-indigo-500",
  trackClass = "bg-slate-200",
  heightClass = "h-2.5",
  label,
}: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={`w-full overflow-hidden rounded-full ${trackClass} ${heightClass}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <div
        className={`${heightClass} rounded-full ${barClass} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
