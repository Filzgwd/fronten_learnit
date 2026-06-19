import { request } from "../../axios/axios";

export const quizApi = {
  getAll: async (signal) => {
    return await request({ method: "get", url: "/quizzes", signal });
  },

  getDetail: async (quizId, signal) => {
    return await request({ method: "get", url: `/quizzes/${quizId}`, signal });
  },

  createQuiz: async (data, signal) => {
    return await request({ method: "post", url: "/quizzes", data, signal });
  },

  updateQuiz: async (id, data, signal) => {
    return await request({ method: "put", url: `/quizzes/${id}`, data, signal });
  },

  deleteQuiz: async (id, signal) => {
    return await request({ method: "delete", url: `/quizzes/${id}`, signal });
  },

  submitQuiz: async (data, signal) => {
    return await request({ method: "post", url: "/quizzes/submit", data, signal });
  },

  getResults: async (signal) => {
    return await request({ method: "get", url: "/quizzes/results/me", signal });
  }
};
