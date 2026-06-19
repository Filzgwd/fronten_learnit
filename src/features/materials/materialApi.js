import { request } from "../../axios/axios";

// ── Per-user progress (user-specific settings, NOT API data cache) ──────────────────────────────────────────
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

export const materialApi = {
  // Fetch all materials from Neon database (NO localStorage fallback)
  getAll: async (signal) => {
    const res = await request({ method: "get", url: "/materials", signal });
    if (!res.ok) {
      throw new Error("Failed to fetch materials from database");
    }
    return res;
  },

  // Returns progress object for the CURRENT user (stored in localStorage)
  getProgress: () => getLocalProgress(),

  // Save progress for the CURRENT user (stored in localStorage)
  saveProgress: (materialId, value) => {
    const progress = getLocalProgress();
    progress[materialId] = Math.min(100, Math.max(0, Number(value)));
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    return progress;
  },

  getDefaultMaterials: () => [],

  createMaterial: async (data, signal) => {
    return await request({ method: "post", url: "/materials", data, signal });
  },

  updateMaterial: async (id, data, signal) => {
    return await request({ method: "put", url: `/materials/${id}`, data, signal });
  },

  deleteMaterial: async (id, signal) => {
    return await request({ method: "delete", url: `/materials/${id}`, signal });
  },
};
