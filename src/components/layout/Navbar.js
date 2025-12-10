"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          BlogHub
        </Link>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search blogs..."
            className="navbar-search-input"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                navigate(`/?search=${e.target.value}`)
              }
            }}
          />
        </div>

        <div className="navbar-links">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <Link to="/" className="navbar-link">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/blogs/create" className="navbar-link">
                Write
              </Link>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <div className="navbar-dropdown">
                <button className="navbar-dropdown-btn">{user.name.split(" ")[0]}</button>
                <div className="navbar-dropdown-content">
                  <Link to={`/profile/${user.id}`}>Profile</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

