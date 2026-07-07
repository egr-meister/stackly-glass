import { lastNDates, isValidDateStr } from './dates';
import { DEFAULT_GOAL_ML } from '../defaults';

export function entriesForDate(entries, date) {
  const list = Array.isArray(entries) ? entries : [];
  return list.filter((item) => item?.date === date);
}

export function sortDayEntries(dayEntries) {
  const list = Array.isArray(dayEntries) ? dayEntries : [];
  return list
    .slice()
    .sort((a, b) =>
      `${a?.time ?? ''}${a?.createdAt ?? ''}`.localeCompare(`${b?.time ?? ''}${b?.createdAt ?? ''}`)
    );
}

export function totalMlForDate(entries, date) {
  return entriesForDate(entries, date).reduce(
    (sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0)),
    0
  );
}

export function progressPercent(totalMl, goalMl) {
  const goal = Number(goalMl);
  if (!Number.isFinite(goal) || goal <= 0) return 0;
  const total = Math.max(0, Number(totalMl) || 0);
  return Math.round((total / goal) * 100);
}

export function formatLiters(ml) {
  const n = Math.max(0, Number(ml) || 0);
  return `${(n / 1000).toFixed(1)} L`;
}

// DailySummary list for all days that have entries, newest first.
export function buildDailySummaries(entries, goalMl) {
  const list = Array.isArray(entries) ? entries : [];
  const goal = Number.isFinite(Number(goalMl)) && Number(goalMl) > 0 ? Number(goalMl) : DEFAULT_GOAL_ML;
  const dates = [];
  for (const item of list) {
    const date = item?.date;
    if (isValidDateStr(date) && !dates.includes(date)) dates.push(date);
  }
  dates.sort((a, b) => b.localeCompare(a));
  return dates.map((date) => {
    const dayEntries = entriesForDate(list, date);
    const totalMl = dayEntries.reduce((sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0)), 0);
    return {
      date,
      totalMl,
      goalMl: goal,
      progressPercent: progressPercent(totalMl, goal),
      entriesCount: dayEntries.length,
      reachedGoal: totalMl >= goal,
    };
  });
}

// WeeklyStats over the last 7 calendar days, including today.
export function buildWeeklyStats(entries, goalMl) {
  const list = Array.isArray(entries) ? entries : [];
  const goal = Number.isFinite(Number(goalMl)) && Number(goalMl) > 0 ? Number(goalMl) : DEFAULT_GOAL_ML;
  const dates = lastNDates(7);
  const days = dates.map((date) => {
    const dayEntries = entriesForDate(list, date);
    const totalMl = dayEntries.reduce((sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0)), 0);
    return { date, totalMl, entriesCount: dayEntries.length };
  });
  const totalMl = days.reduce((sum, d) => sum + d.totalMl, 0);
  let best = null;
  for (const d of days) {
    if (d.totalMl > 0 && (!best || d.totalMl > best.totalMl)) best = d;
  }
  return {
    startDate: dates[0] ?? '',
    endDate: dates[dates.length - 1] ?? '',
    totalMl,
    averageMl: Math.round(totalMl / 7),
    bestDayDate: best ? best.date : null,
    bestDayTotalMl: best ? best.totalMl : 0,
    goalDaysCount: days.filter((d) => d.totalMl >= goal).length,
    entriesCount: days.reduce((sum, d) => sum + d.entriesCount, 0),
    days,
  };
}
