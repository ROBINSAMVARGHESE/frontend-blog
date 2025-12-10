"use client"

import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useTheme } from "./context/ThemeContext"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ProtectedRoute from "./components/routing/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import BlogDetails from "./pages/BlogDetails"
import Dashboard from "./pages/Dashboard"
import CreateBlog from "./pages/CreateBlog"
import EditBlog from "./pages/EditBlog"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme
  }, [theme])

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/blogs/edit/:id" element={<EditBlog />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

