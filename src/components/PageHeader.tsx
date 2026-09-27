import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: ReactNode;
  backTo?: string;
  icon?: string;
}

export function PageHeader({ title, subtitle, backTo, icon }: Props) {
  return (
    <div className="mb-4">
      {backTo && (
        <Link to={backTo} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">
          ← Zurück
        </Link>
      )}
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
        {icon && <span>{icon}</span>}
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
    </div>
  );
}
