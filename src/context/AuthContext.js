import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper: set / remove axios default Authorization header
  const setAxiosAuthHeader = (tok) => {
    if (tok) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  //🔥 Initialize axios Authorization header ONCE on app load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setAxiosAuthHeader(storedToken);
  }, []);

  //🔥 Load logged-in user using the token
  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUser(res.data.user || null);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        // Auto logout on expired/invalid token
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        setAxiosAuthHeader(null);
        setError("Session expired. Please login again.");
      } else {
        setUser(null);
        setError(err.response?.data?.message || "Failed to load user");
      }
    }
  }, [token]);

  // Load user whenever token changes
  useEffect(() => {
    if (token) {
      setAxiosAuthHeader(token);
      loadUser();
    } else {
      setUser(null);
      setAxiosAuthHeader(null);
    }
  }, [token, loadUser]);

  // REGISTER (no auto login)
  const register = async (data) => {
    try {
      setLoading(true);
      setError("");
      await axios.post(`${API_URL}/api/auth/register`, data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (data) => {
    console.log(login)
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${API_URL}/api/auth/login`, data);

      const tok = res.data.token;
      if (!tok) {
        setError("Login succeeded but token missing");
        return false;
      }

      setToken(tok);
      localStorage.setItem("token", tok);
      setAxiosAuthHeader(tok);
      setUser(res.data.user || null);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setAxiosAuthHeader(null);
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
