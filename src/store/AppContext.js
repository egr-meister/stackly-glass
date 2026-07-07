import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadData, saveData, clearData } from '../storage';
import {
  defaultSettings,
  defaultGlassPresets,
  sanitizeSettings,
  sanitizeEntries,
  sanitizeAmountMl,
  sanitizeGoalMl,
  MAX_ENTRY_ML,
} from '../defaults';
import { todayStr, nowTimeStr, isValidDateStr, isValidTimeStr } from '../utils/dates';

const AppContext = createContext(null);

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function AppProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const raw = await loadData();
      if (!mounted) return;
      setEntries(sanitizeEntries(raw?.entries));
      setSettings(sanitizeSettings(raw?.settings));
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((nextEntries, nextSettings) => {
    setEntries(nextEntries);
    setSettings(nextSettings);
    saveData({ entries: nextEntries, settings: nextSettings });
  }, []);

  const selectedGlass = useMemo(() => {
    const presets = Array.isArray(settings?.glassPresets) ? settings.glassPresets : defaultGlassPresets;
    return (
      presets.find((item) => item?.id === settings?.selectedGlassId) ??
      defaultGlassPresets[1]
    );
  }, [settings]);

  // Adds a water entry. Returns true on success, false on invalid input.
  const addEntry = useCallback(
    (fields) => {
      const amountMl = sanitizeAmountMl(fields?.amountMl, 0);
      if (amountMl <= 0 || amountMl > MAX_ENTRY_ML) return false;
      const date = isValidDateStr(fields?.date) ? fields.date : todayStr();
      const time = isValidTimeStr(fields?.time) ? fields.time : nowTimeStr();
      const nowIso = new Date().toISOString();
      const entry = {
        id: makeId(),
        date,
        time,
        amountMl,
        label: typeof fields?.label === 'string' ? fields.label.trim() : '',
        source: typeof fields?.source === 'string' ? fields.source : 'custom',
        presetName: typeof fields?.presetName === 'string' ? fields.presetName : '',
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      persist([...entries, entry], settings);
      return true;
    },
    [entries, settings, persist]
  );

  // One-tap add: logs the currently selected glass preset.
  const addGlass = useCallback(() => {
    const glass = selectedGlass ?? defaultGlassPresets[1];
    return addEntry({
      amountMl: glass?.amountMl ?? 250,
      source: glass?.id ?? 'regular_glass',
      presetName: glass?.name ?? 'Regular Glass',
      label: '',
    });
  }, [addEntry, selectedGlass]);

  const updateEntry = useCallback(
    (id, fields) => {
      const index = entries.findIndex((item) => item?.id === id);
      if (index < 0) return false;
      const current = entries[index];
      const amountMl = sanitizeAmountMl(fields?.amountMl, current?.amountMl ?? 0);
      if (amountMl <= 0) return false;
      const next = entries.slice();
      next[index] = {
        ...current,
        date: isValidDateStr(fields?.date) ? fields.date : current?.date,
        time: isValidTimeStr(fields?.time) ? fields.time : current?.time,
        amountMl,
        label: typeof fields?.label === 'string' ? fields.label.trim() : current?.label ?? '',
        updatedAt: new Date().toISOString(),
      };
      persist(next, settings);
      return true;
    },
    [entries, settings, persist]
  );

  const deleteEntry = useCallback(
    (id) => {
      const next = entries.filter((item) => item?.id !== id);
      if (next.length === entries.length) return false;
      persist(next, settings);
      return true;
    },
    [entries, settings, persist]
  );

  // Removes only the most recent entry for today. Safe when today is empty.
  const undoLastToday = useCallback(() => {
    const date = todayStr();
    const todayEntries = entries.filter((item) => item?.date === date);
    if (todayEntries.length === 0) return false;
    let latest = todayEntries[0];
    for (const item of todayEntries) {
      if (`${item?.createdAt ?? ''}`.localeCompare(`${latest?.createdAt ?? ''}`) >= 0) {
        latest = item;
      }
    }
    return deleteEntry(latest?.id);
  }, [entries, deleteEntry]);

  // Removes all entries for one day; keeps everything else.
  const resetDay = useCallback(
    (date) => {
      const next = entries.filter((item) => item?.date !== date);
      persist(next, settings);
      return true;
    },
    [entries, settings, persist]
  );

  const deleteAllEntries = useCallback(() => {
    persist([], settings);
  }, [settings, persist]);

  const updateSettings = useCallback(
    (partial) => {
      const next = sanitizeSettings({ ...settings, ...(partial ?? {}) });
      persist(entries, next);
    },
    [entries, settings, persist]
  );

  const setGoal = useCallback(
    (goalMl) => {
      updateSettings({ dailyGoalMl: sanitizeGoalMl(goalMl) });
    },
    [updateSettings]
  );

  const setSelectedGlass = useCallback(
    (id) => {
      updateSettings({ selectedGlassId: id });
    },
    [updateSettings]
  );

  const updatePresets = useCallback(
    (presets) => {
      const stamped = (Array.isArray(presets) ? presets : []).map((item) => ({
        ...item,
        updatedAt: new Date().toISOString(),
      }));
      updateSettings({ glassPresets: stamped });
    },
    [updateSettings]
  );

  const resetPresets = useCallback(() => {
    updateSettings({ glassPresets: defaultGlassPresets.map((item) => ({ ...item })) });
  }, [updateSettings]);

  const setReminders = useCallback(
    (reminders) => {
      updateSettings({ reminders });
    },
    [updateSettings]
  );

  const setCompactMode = useCallback(
    (compactMode) => {
      updateSettings({ compactMode: compactMode === true });
    },
    [updateSettings]
  );

  const completeOnboarding = useCallback(() => {
    updateSettings({ onboardingCompleted: true });
  }, [updateSettings]);

  const resetAll = useCallback(() => {
    clearData();
    setEntries([]);
    setSettings({ ...defaultSettings, onboardingCompleted: true });
    saveData({ entries: [], settings: { ...defaultSettings, onboardingCompleted: true } });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      entries,
      settings,
      selectedGlass,
      addEntry,
      addGlass,
      updateEntry,
      deleteEntry,
      undoLastToday,
      resetDay,
      deleteAllEntries,
      updateSettings,
      setGoal,
      setSelectedGlass,
      updatePresets,
      resetPresets,
      setReminders,
      setCompactMode,
      completeOnboarding,
      resetAll,
    }),
    [
      ready,
      entries,
      settings,
      selectedGlass,
      addEntry,
      addGlass,
      updateEntry,
      deleteEntry,
      undoLastToday,
      resetDay,
      deleteAllEntries,
      updateSettings,
      setGoal,
      setSelectedGlass,
      updatePresets,
      resetPresets,
      setReminders,
      setCompactMode,
      completeOnboarding,
      resetAll,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
