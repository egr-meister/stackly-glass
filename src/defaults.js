// Default values and sanitizers. Every loader merges stored data with these
// defaults so the app never crashes on empty, partial, or corrupted storage.

export const DEFAULT_GOAL_ML = 2000;
export const MAX_GOAL_ML = 10000;
export const MAX_ENTRY_ML = 5000;

export const defaultGlassPresets = [
  { id: 'small_glass', name: 'Small Glass', amountMl: 150, updatedAt: '' },
  { id: 'regular_glass', name: 'Regular Glass', amountMl: 250, updatedAt: '' },
  { id: 'large_glass', name: 'Large Glass', amountMl: 350, updatedAt: '' },
  { id: 'bottle', name: 'Bottle', amountMl: 500, updatedAt: '' },
];

export const defaultReminderSettings = {
  enabled: true,
  morningEnabled: true,
  afternoonEnabled: true,
  eveningEnabled: true,
};

export const defaultSettings = {
  onboardingCompleted: false,
  dailyGoalMl: DEFAULT_GOAL_ML,
  compactMode: false,
  selectedGlassId: 'regular_glass',
  glassPresets: defaultGlassPresets,
  reminders: defaultReminderSettings,
};

const PRESET_IDS = ['small_glass', 'regular_glass', 'large_glass', 'bottle'];
const SOURCES = ['small_glass', 'regular_glass', 'large_glass', 'bottle', 'custom'];

function safeNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function sanitizeAmountMl(value, fallback = 0) {
  const n = Math.round(safeNumber(value, fallback));
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, MAX_ENTRY_ML);
}

export function sanitizeGoalMl(value) {
  const n = Math.round(safeNumber(value, DEFAULT_GOAL_ML));
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_GOAL_ML;
  return Math.min(n, MAX_GOAL_ML);
}

export function sanitizePresets(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return defaultGlassPresets.map((def) => {
    const found = list.find((item) => item?.id === def.id);
    if (!found) return { ...def };
    const name = safeString(found?.name, def.name).trim() || def.name;
    const amountMl = sanitizeAmountMl(found?.amountMl, def.amountMl);
    return {
      id: def.id,
      name,
      amountMl,
      updatedAt: safeString(found?.updatedAt, ''),
    };
  });
}

export function sanitizeReminders(raw) {
  return {
    enabled: typeof raw?.enabled === 'boolean' ? raw.enabled : defaultReminderSettings.enabled,
    morningEnabled:
      typeof raw?.morningEnabled === 'boolean' ? raw.morningEnabled : defaultReminderSettings.morningEnabled,
    afternoonEnabled:
      typeof raw?.afternoonEnabled === 'boolean'
        ? raw.afternoonEnabled
        : defaultReminderSettings.afternoonEnabled,
    eveningEnabled:
      typeof raw?.eveningEnabled === 'boolean' ? raw.eveningEnabled : defaultReminderSettings.eveningEnabled,
  };
}

export function sanitizeSettings(raw) {
  const glassPresets = sanitizePresets(raw?.glassPresets);
  let selectedGlassId = safeString(raw?.selectedGlassId, defaultSettings.selectedGlassId);
  if (!PRESET_IDS.includes(selectedGlassId)) selectedGlassId = defaultSettings.selectedGlassId;
  return {
    onboardingCompleted: raw?.onboardingCompleted === true,
    dailyGoalMl: sanitizeGoalMl(raw?.dailyGoalMl),
    compactMode: raw?.compactMode === true,
    selectedGlassId,
    glassPresets,
    reminders: sanitizeReminders(raw?.reminders),
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function sanitizeEntries(raw) {
  const list = Array.isArray(raw) ? raw : [];
  const out = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const amountMl = sanitizeAmountMl(item?.amountMl, 0);
    if (amountMl <= 0) continue;
    const date = safeString(item?.date, '');
    if (!DATE_RE.test(date)) continue;
    let time = safeString(item?.time, '');
    if (!TIME_RE.test(time)) time = '00:00';
    const source = SOURCES.includes(item?.source) ? item.source : 'custom';
    out.push({
      id: safeString(item?.id, '') || `${Date.now()}_${out.length}_${Math.random().toString(36).slice(2, 8)}`,
      date,
      time,
      amountMl,
      label: safeString(item?.label, ''),
      source,
      presetName: safeString(item?.presetName, ''),
      createdAt: safeString(item?.createdAt, ''),
      updatedAt: safeString(item?.updatedAt, ''),
    });
  }
  return out;
}
