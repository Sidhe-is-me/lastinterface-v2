// ═══════════════════════════════════════════════════════════
// Storage Utilities
// TODO: Replace localStorage with database (Supabase/Firebase) for
// cross-device persistence when user authentication is added
// ═══════════════════════════════════════════════════════════

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} fallback - Fallback value if key doesn't exist
 * @returns {any} Parsed data or fallback
 */
export function loadData(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save (will be JSON stringified)
 */
export function saveData(key, data) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
}

/**
 * Delete data from localStorage
 * @param {string} key - Storage key to delete
 */
export function deleteData(key) {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error deleting data for key "${key}":`, error);
  }
}

/**
 * Clear all localStorage data
 */
export function clearAllData() {
  if (typeof window === "undefined") return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
