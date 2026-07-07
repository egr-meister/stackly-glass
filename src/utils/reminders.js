// In-app reminder cards only. No system notifications, no background work.
// A reminder is computed from today's progress and the current time whenever
// the home screen renders. It disappears when conditions no longer apply.

export function getReminderMessage(totalMl, goalMl, entriesCount, reminders, now = new Date()) {
  if (!reminders || reminders.enabled !== true) return null;
  const hour = Number.isFinite(now?.getHours?.()) ? now.getHours() : 0;
  const goal = Number.isFinite(Number(goalMl)) && Number(goalMl) > 0 ? Number(goalMl) : 2000;
  const total = Math.max(0, Number(totalMl) || 0);
  const progress = total / goal;

  if (reminders.morningEnabled && entriesCount === 0 && hour >= 11 && hour < 16) {
    return 'No glasses added today. Add one if you had a drink.';
  }
  if (reminders.afternoonEnabled && progress < 0.5 && hour >= 16 && hour < 19) {
    return "You can still add today's drinks manually.";
  }
  if (reminders.eveningEnabled && progress < 1 && hour >= 19) {
    return 'Add any glasses you missed today.';
  }
  return null;
}
