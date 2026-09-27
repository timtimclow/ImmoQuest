import levelsJson from "../data/levels.json";
import type { Level } from "../types";

export const levels: Level[] = levelsJson;

/** Ab dem letzten definierten Level kommt alle 600 XP ein weiteres Level (Titel bleibt). */
const EXTRA_LEVEL_XP = 600;

export interface LevelInfo {
  level: number;
  title: string;
  /** XP, ab denen dieses Level beginnt. */
  startXp: number;
  /** XP, ab denen das nächste Level beginnt. */
  nextXp: number;
  nextTitle: string;
  /** 0–1: Fortschritt innerhalb des aktuellen Levels. */
  fraction: number;
}

export function levelInfo(xp: number): LevelInfo {
  const last = levels[levels.length - 1];
  if (xp >= last.xp) {
    const extra = Math.floor((xp - last.xp) / EXTRA_LEVEL_XP);
    const startXp = last.xp + extra * EXTRA_LEVEL_XP;
    return {
      level: last.level + extra,
      title: last.title,
      startXp,
      nextXp: startXp + EXTRA_LEVEL_XP,
      nextTitle: last.title,
      fraction: (xp - startXp) / EXTRA_LEVEL_XP,
    };
  }
  let idx = 0;
  for (let i = 0; i < levels.length; i++) if (xp >= levels[i].xp) idx = i;
  const cur = levels[idx];
  const next = levels[idx + 1];
  return {
    level: cur.level,
    title: cur.title,
    startXp: cur.xp,
    nextXp: next.xp,
    nextTitle: next.title,
    fraction: (xp - cur.xp) / (next.xp - cur.xp),
  };
}
