import axios from "axios";
import { API_URL } from "../config";

// Helper to get Authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

// Helper to normalize/throw Error objects
const throwFormattedError = (err, fallbackMessage) => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.message ||
    (typeof err === "string" ? err : null) ||
    fallbackMessage;
  throw new Error(msg);
};

// ----------------- BLOGS API -----------------

export const fetchBlogs = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await axios.get(
      `${API_URL}/api/blogs?page=${page}&limit=${limit}&search=${search}`
    );
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to fetch blogs");
  }
};

export const fetchBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs/${id}`);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to fetch blog");
  }
};

// ----------- FIXED FINAL WORKING VERSION -------------
export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login.");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(`${API_URL}/api/blogs`, blogData, config);
    return res.data;

  } catch (error) {
    throw error.response?.data || new Error("Failed to create blog");
  }
};

// ------------------------------------------------------

export const updateBlog = async (id, blogData) => {
  try {
    const config = getAuthConfig();
    const res = await axios.put(`${API_URL}/api/blogs/${id}`, blogData, config);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to update blog");
  }
};

export const deleteBlog = async (id) => {
  try {
    const config = getAuthConfig();
    const res = await axios.delete(`${API_URL}/api/blogs/${id}`, config);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to delete blog");
  }
};

export const fetchUserBlogs = async (page = 1, limit = 10) => {
  try {
    const config = getAuthConfig();
    const res = await axios.get(
      `${API_URL}/api/blogs/user?page=${page}&limit=${limit}`,
      config
    );
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to fetch user blogs");
  }
};

// ----------------- COMMENTS API -----------------

export const fetchComments = async (blogId) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments/${blogId}`);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to fetch comments");
  }
};

export const addComment = async (commentData) => {
  try {
    const config = getAuthConfig();
    const res = await axios.post(`${API_URL}/api/comments`, commentData, config);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to add comment");
  }
};

export const deleteComment = async (id) => {
  try {
    const config = getAuthConfig();
    const res = await axios.delete(`${API_URL}/api/comments/${id}`, config);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to delete comment");
  }
};

// ----------------- USER API -----------------

export const fetchUserProfile = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/${id}`);
    return res.data;
  } catch (error) {
    throwFormattedError(error, "Failed to fetch user profile");
  }
};
