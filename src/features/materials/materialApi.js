import { request } from "../../axios/axios";

// Map category names to learning path keys
const categoryToPath = {
  "Algoritma & Pemrograman": "algoritma",
  "Pengembangan Website": "website",
  "Desain UI/UX": "uiux",
  "Kecerdasan Buatan": "ai",
  "Pemrograman Mobile": "mobile",
};

// Transform material to add path field based on category
const transformMaterial = (material) => {
  const path = categoryToPath[material.category_name] || "website";
  return {
    ...material,
    path,
    title: material.title || material.name,
    desc: material.description,
  };
};

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
  getAll: async (signal) => {
    console.log("Calling GET /materials");

    const res = await request({
      method: "get",
      url: "/materials",
      signal,
    });

    console.log("Raw materials response:", res);

    if (!res.ok) {
      console.error("Materials request failed:", res);

      throw new Error(
        `Failed to fetch materials. Status: ${res.status}. Error: ${res.error}`
      );
    }

    if (res.data && Array.isArray(res.data)) {
      res.data = res.data.map(transformMaterial);
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
    console.log('🌐 [materialApi.createMaterial] Sending data:', JSON.stringify(data, null, 2));
    const result = await request({ method: "post", url: "/materials", data, signal });
    console.log('🌐 [materialApi.createMaterial] Response:', result);
    return result;
  },

  updateMaterial: async (id, data, signal) => {
    return await request({ method: "put", url: `/materials/${id}`, data, signal });
  },

  deleteMaterial: async (id, signal) => {
    return await request({ method: "delete", url: `/materials/${id}`, signal });
  },
};
