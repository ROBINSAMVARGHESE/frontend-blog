import axios from "axios"
import { API_URL } from "../config"

// Blogs API
export const fetchBlogs = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs?page=${page}&limit=${limit}&search=${search}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch blogs" }
  }
}

export const fetchBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs/${id}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch blog" }
  }
}

export const createBlog = async (blogData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    const res = await axios.post(`${API_URL}/api/blogs`, blogData, config)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to create blog" }
  }
}

export const updateBlog = async (id, blogData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    const res = await axios.put(`${API_URL}/api/blogs/${id}`, blogData, config)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to update blog" }
  }
}

export const deleteBlog = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/api/blogs/${id}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete blog" }
  }
}

export const fetchUserBlogs = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/api/blogs/user?page=${page}&limit=${limit}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user blogs" }
  }
}

// Comments API
export const fetchComments = async (blogId) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments/${blogId}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch comments" }
  }
}

export const addComment = async (commentData) => {
  try {
    const res = await axios.post(`${API_URL}/api/comments`, commentData)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to add comment" }
  }
}

export const deleteComment = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/api/comments/${id}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete comment" }
  }
}

// User API
export const fetchUserProfile = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/${id}`)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" }
  }
}

