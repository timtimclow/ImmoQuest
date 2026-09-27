import { Link } from "react-router-dom";
import { useProgress } from "../lib/progress";
import { dayKey } from "../lib/date";
import { questionsByTopic, topics } from "../lib/content";
import { masteredCount } from "../lib/sessions";
import { colorClasses } from "../lib/colors";
import { ProgressBar } from "../components/ProgressBar";

export function Home() {
  const { progress, level, streakDays } = useProgress();
  const daily = progress.daily[dayKey()];
  const reviewCount = progress.review.length;
  const xpToNext = level.nextXp - progress.xp;

  return (
    <div className="space-y-4">
      {/* Level & Streak */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-100">Dein Rang</p>
            <h1 className="text-3xl font-extrabold">{level.title}</h1>
            <p className="text-sm text-indigo-100">Level {level.level}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2 text-center">
            <div className="text-2xl font-extrabold">🔥 {streakDays}</div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-indigo-100">
              {streakDays === 1 ? "Tag" : "Tage"} Streak
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar
            value={level.fraction}
            barClass="bg-amber-300"
            trackClass="bg-white/25"
            heightClass="h-3"
            label="Fortschritt zum nächsten Level"
          />
          <p className="mt-1.5 text-xs text-indigo-100">
            ⭐ {progress.xp} XP · noch {xpToNext} XP bis Level {level.level + 1}
            {level.nextTitle !== level.title && <> ({level.nextTitle})</>}
          </p>
        </div>
        {streakDays === 0 && (
          <p className="mt-3 rounded-xl bg-white/15 p-2 text-sm">
            Beantworte heute eine Frage und starte deine Streak! 🚀
          </p>
        )}
      </section>

      {/* Tages-Challenge */}
      <Link
        to="/tages-challenge"
        className="card flex items-center gap-4 ring-amber-300 transition active:scale-[0.99]"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
          📅
        </span>
        <div className="flex-1">
          <h2 className="font-bold text-slate-900">Tages-Challenge</h2>
          {daily ? (
            <p className="text-sm text-emerald-700">
              ✅ Heute geschafft: {daily.score}/{daily.total} richtig. Morgen gibt es 5 neue Fragen!
            </p>
          ) : (
            <p className="text-sm text-slate-600">5 gemischte Fragen · +25 Bonus-XP</p>
          )}
        </div>
        <span className="text-xl text-slate-400">›</span>
      </Link>

      {/* Wiederholen */}
      {reviewCount > 0 && (
        <Link
          to="/wiederholen"
          className="card flex items-center gap-4 ring-rose-200 transition active:scale-[0.99]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-3xl">
            🔁
          </span>
          <div className="flex-1">
            <h2 className="font-bold text-slate-900">Wiederholen</h2>
            <p className="text-sm text-slate-600">
              {reviewCount} {reviewCount === 1 ? "Frage wartet" : "Fragen warten"} auf dich – hier lernst du aus Fehlern.
            </p>
          </div>
          <span className="text-xl text-slate-400">›</span>
        </Link>
      )}

      {/* Themen */}
      <section>
        <h2 className="mb-2 mt-2 text-lg font-extrabold text-slate-900">Deine Themen</h2>
        <ul className="space-y-2.5">
          {topics.map((t) => {
            const qs = questionsByTopic(t.id);
            const done = masteredCount(progress, qs);
            const c = colorClasses[t.color];
            return (
              <li key={t.id}>
                <Link
                  to={t.id === "rechnen" ? "/rechnen" : `/thema/${t.id}`}
                  className="card flex items-center gap-3 transition active:scale-[0.99]"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${c.soft}`}
                  >
                    {t.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="truncate font-bold text-slate-900">{t.title}</h3>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
                        {done}/{qs.length}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        value={qs.length ? done / qs.length : 0}
                        barClass={c.bar}
                        heightClass="h-2"
                        label={`${t.title}: ${done} von ${qs.length} gemeistert`}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
