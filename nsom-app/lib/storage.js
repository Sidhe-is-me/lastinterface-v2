// localStorage wrapper for persistent data
// Replaces Claude artifact's window.storage API

const STORAGE_PREFIX = "nsom_";

export const storage = {
  async get(key) {
    try {
      if (typeof window === "undefined") return null;
      const value = localStorage.getItem(STORAGE_PREFIX + key);
      if (value === null) return null;
      return { key, value };
    } catch {
      return null;
    }
  },

  async set(key, value) {
    try {
      if (typeof window === "undefined") return null;
      localStorage.setItem(STORAGE_PREFIX + key, value);
      return { key, value };
    } catch {
      return null;
    }
  },

  async delete(key) {
    try {
      if (typeof window === "undefined") return null;
      localStorage.removeItem(STORAGE_PREFIX + key);
      return { key, deleted: true };
    } catch {
      return null;
    }
  },
};
