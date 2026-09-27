import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useProgress } from "../lib/progress";

function LevelUpToast() {
  const { levelUp, dismissLevelUp } = useProgress();
  useEffect(() => {
    if (!levelUp) return;
    const t = window.setTimeout(dismissLevelUp, 7000);
    return () => window.clearTimeout(t);
  }, [levelUp, dismissLevelUp]);

  if (!levelUp) return null;
  return (
    <button
      type="button"
      onClick={dismissLevelUp}
      className="animate-pop fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-left text-white shadow-xl"
    >
      <div className="text-xl font-extrabold">🎉 Level-Aufstieg!</div>
      <div className="text-sm font-medium text-white/95">
        Du bist jetzt <strong>Level {levelUp.level}</strong> – {levelUp.title}. Weiter so!
      </div>
    </button>
  );
}

function Header() {
  const { level, streakDays, progress } = useProgress();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-indigo-700">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          ImmoQuest
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Link
            to="/profil"
            className="chip bg-indigo-50 text-indigo-700"
            title={`Level ${level.level} – ${level.title}`}
          >
            Lv {level.level}
          </Link>
          <span
            className={`chip ${streakDays > 0 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`}
            title="Lern-Streak in Tagen"
          >
            🔥 {streakDays}
          </span>
          <span className="chip bg-amber-100 text-amber-800" title="Erfahrungspunkte">
            ⭐ {progress.xp}
          </span>
        </div>
      </div>
    </header>
  );
}

const NAV = [
  { to: "/", label: "Start", icon: "🏠", end: true },
  { to: "/spielen", label: "Spielen", icon: "🎮", end: false },
  { to: "/kaufen", label: "Kaufen", icon: "🔑", end: false },
  { to: "/profil", label: "Profil", icon: "👤", end: false },
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs font-semibold ${
                  isActive ? "text-indigo-700" : "text-slate-500"
                }`
              }
            >
              <span className="text-xl leading-none">{n.icon}</span>
              {n.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

/** Normales Layout mit Kopfzeile und Navigation unten. */
export function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-4 pb-28">
        <Outlet />
      </main>
      <BottomNav />
      <LevelUpToast />
    </>
  );
}

/** Fokus-Layout für Lern-Sitzungen (keine Navigation, mehr Platz zum Lesen). */
export function FocusLayout() {
  return (
    <>
      <ScrollToTop />
      <main className="mx-auto max-w-2xl px-4 pb-6">
        <Outlet />
      </main>
      <LevelUpToast />
    </>
  );
}
