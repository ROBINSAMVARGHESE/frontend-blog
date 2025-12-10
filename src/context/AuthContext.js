"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await axios.get(`${API_URL}/api/auth/me`)
        setUser(res.data.user)
      } catch (err) {
        console.error("Error loading user:", err)
        localStorage.removeItem("token")
        setToken(null)
        setError("Session expired. Please login again.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData)

      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      // Ensure axios has the auth header immediately to avoid race conditions
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)

      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, userData)

      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      // Ensure axios has the auth header immediately to avoid race conditions
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)

      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    // Remove axios default authorization header
    delete axios.defaults.headers.common["Authorization"]
    navigate("/")
  }

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, userData)
      setUser(res.data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

