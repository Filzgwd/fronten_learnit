import { request } from "../../axios/axios";

export const forumApi = {
  getAllPosts: async (signal) => {
    return await request({
      method: "get",
      url: "/forum-posts",
      signal,
    });
  },

  createPost: async (content, signal) => {
    return await request({
      method: "post",
      url: "/forum-posts",
      data: {
        title: content.slice(0, 50) || "Diskusi",
        content: content,
      },
      signal,
    });
  },

  getCommentsByPost: async (postId, signal) => {
    return await request({
      method: "get",
      url: `/comments/post/${postId}`,
      signal,
    });
  },

  createComment: async (postId, content, signal) => {
    return await request({
      method: "post",
      url: "/comments",
      data: {
        post_id: postId,
        content: content,
      },
      signal,
    });
  },
};
