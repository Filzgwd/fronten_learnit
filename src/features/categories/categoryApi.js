import { request } from "../../axios/axios";

// Map category names to learning path keys
const categoryToPath = {
  "Algoritma & Pemrograman": "algoritma",
  "Pengembangan Website": "website",
  "Desain UI/UX": "uiux",
  "Kecerdasan Buatan": "ai",
  "Pemrograman Mobile": "mobile",
};

export const categoryApi = {
  // Fetch all categories
  getAll: async (signal) => {
    const res = await request({ method: "get", url: "/categories", signal });
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    return res;
  },

  // Map category name to path
  getCategoryPath: (categoryName) => {
    return categoryToPath[categoryName] || "website";
  },

  createCategory: async (data, signal) => {
    return await request({ method: "post", url: "/categories", data, signal });
  },
};
