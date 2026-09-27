import type { TopicColor } from "../types";

/** Tailwind braucht vollständige Klassennamen im Code – deshalb diese Tabelle. */
export const colorClasses: Record<
  TopicColor,
  { solid: string; soft: string; text: string; bar: string; ring: string }
> = {
  indigo: { solid: "bg-indigo-600", soft: "bg-indigo-50", text: "text-indigo-700", bar: "bg-indigo-500", ring: "ring-indigo-200" },
  emerald: { solid: "bg-emerald-600", soft: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", ring: "ring-emerald-200" },
  amber: { solid: "bg-amber-500", soft: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500", ring: "ring-amber-200" },
  rose: { solid: "bg-rose-600", soft: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-500", ring: "ring-rose-200" },
  sky: { solid: "bg-sky-600", soft: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-500", ring: "ring-sky-200" },
  violet: { solid: "bg-violet-600", soft: "bg-violet-50", text: "text-violet-700", bar: "bg-violet-500", ring: "ring-violet-200" },
  teal: { solid: "bg-teal-600", soft: "bg-teal-50", text: "text-teal-700", bar: "bg-teal-500", ring: "ring-teal-200" },
  orange: { solid: "bg-orange-500", soft: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500", ring: "ring-orange-200" },
};
