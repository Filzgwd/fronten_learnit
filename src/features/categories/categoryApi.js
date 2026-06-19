import { request } from "../../axios/axios";

export const categoryApi = {
  // Fetch all categories
  getAll: async (signal) => {
    const res = await request({ method: "get", url: "/categories", signal });
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    return res;
  },

  createCategory: async (data, signal) => {
    return await request({ method: "post", url: "/categories", data, signal });
  },
};
