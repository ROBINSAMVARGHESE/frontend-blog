import axios from "axios";
import { API_URL } from "../config";

// ----------------- Helper Functions -----------------

// Get Authorization header (supports multipart/form-data)
export const getAuthConfig = (isMultipart = false) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};




// Format and throw errors
const throwFormattedError = (err, fallbackMessage) => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data ||
    (typeof err === "string" ? err : null) ||
    fallbackMessage;
  throw new Error(message);
};

// ----------------- BLOGS API -----------------

export const fetchBlogs = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to fetch blogs");
  }
};

export const fetchBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs/${id}`);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to fetch blog");
  }
};

export const createBlog = async (blogData) => {
  try {
    const config = getAuthConfig(true); 
    const res = await axios.post(`${API_URL}/api/blogs`, blogData, config);
   
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create blog");
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const config = getAuthConfig(true); // support file upload
    const res = await axios.put(`${API_URL}/api/blogs/${id}`, blogData, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to update blog");
  }
};

export const deleteBlog = async (id) => {
  try {
    const config = getAuthConfig();
    const res = await axios.delete(`${API_URL}/api/blogs/${id}`, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to delete blog");
  }
};

export const fetchUserBlogs = async (page = 1, limit = 10) => {
  try {
    const config = getAuthConfig();
    const res = await axios.get(`${API_URL}/api/blogs/user?page=${page}&limit=${limit}`, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to fetch user blogs");
  }
};

// ----------------- COMMENTS API -----------------

export const fetchComments = async (blogId) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments/${blogId}`);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to fetch comments");
  }
};

export const addComment = async (commentData) => {
  try {
    const config = getAuthConfig();
    const res = await axios.post(`${API_URL}/api/comments`, commentData, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to add comment");
  }
};

export const deleteComment = async (id) => {
  try {
    const config = getAuthConfig();
    const res = await axios.delete(`${API_URL}/api/comments/${id}`, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to delete comment");
  }
};

// ----------------- USER API -----------------

export const fetchUserProfile = async (id = null) => {
  try {
    const config = getAuthConfig();
    // if no id provided, fetch current user using /me endpoint
    const endpoint = id ? `${API_URL}/api/users/${id}` : `${API_URL}/api/users/me`;
    const res = await axios.get(endpoint, config);
    return res.data;
  } catch (err) {
    throwFormattedError(err, "Failed to fetch user profile");
  }
};
