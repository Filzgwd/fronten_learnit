import { request } from "../../axios/axios";
import { defaultMaterials } from "./learningPaths";

const MATERIALS_STORAGE_KEY = "adminMaterials";

// ── Per-user progress ──────────────────────────────────────────
function getCurrentUserId() {
  try {
    // Try to read from local current user first
    const localUser = JSON.parse(localStorage.getItem("localCurrentUser"));
    if (localUser?.id) return localUser.id;

    // Try to parse from JWT token
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id || payload?.sub) return String(payload.id || payload.sub);
    }
  } catch {
    // ignore
  }
  return "guest";
}

function getProgressKey() {
  return `materialProgress_${getCurrentUserId()}`;
}

function getLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem(getProgressKey())) || {};
  } catch {
    return {};
  }
}

function getLocalMaterials() {
  try {
    const data = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading materials from localStorage", e);
  }
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(defaultMaterials));
  } catch (e) {
    console.error("Error saving default materials to localStorage", e);
  }
  return defaultMaterials;
}

export const materialApi = {
  getAll: async (signal) => {
    try {
      const res = await request({ method: "get", url: "/materials", signal });
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(res.data));
        return res;
      }
    } catch (err) {
      console.warn("Backend fetch failed, using local storage", err);
    }
    return {
      ok: true,
      data: getLocalMaterials(),
      status: 200,
    };
  },

  // Returns progress object for the CURRENT user
  getProgress: () => getLocalProgress(),

  // Save progress for the CURRENT user
  saveProgress: (materialId, value) => {
    const progress = getLocalProgress();
    progress[materialId] = Math.min(100, Math.max(0, Number(value)));
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    return progress;
  },

  getDefaultMaterials: () => defaultMaterials,

  getLocalMaterials: () => getLocalMaterials(),

  saveAllMaterials: (materials) => {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
    return materials;
  },
};
