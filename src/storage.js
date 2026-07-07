import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'stackly_glass_data_v1';

// Loads raw stored data. Returns null on empty or corrupted storage so the
// caller always falls back to safe defaults. Never throws.
export async function loadData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Persists app data. Never throws.
export async function saveData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data ?? {}));
  } catch (error) {
    // Ignore write errors; in-memory state stays usable.
  }
}

// Removes all stored app data. Never throws.
export async function clearData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore.
  }
}
