"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchUserBlogs, deleteBlog } from "../services/api"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/ui/Spinner"
import Pagination from "../components/ui/Pagination"
import "./Dashboard.css"

const Dashboard = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })

  const { user } = useAuth()

  useEffect(() => {
    const loadUserBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetchUserBlogs(pagination.page, pagination.limit)
        setBlogs(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err.message || "Failed to load blogs")
      } finally {
        setLoading(false)
      }
    }

    loadUserBlogs()
  }, [pagination.page, pagination.limit])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id)
        setBlogs(blogs.filter((blog) => blog._id !== id))
      } catch (err) {
        alert("Failed to delete blog")
      }
    }
  }

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/blogs/create" className="btn btn-primary">
          Create New Blog
        </Link>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-user-info">
        <h2>Welcome, {user?.name}</h2>
        <p>
          You have published {pagination.total} blog{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="dashboard-empty">
          <p>You haven't created any blogs yet.</p>
          <Link to="/blogs/create" className="btn btn-primary">
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <>
          <div className="dashboard-blogs">
            <h3>Your Blogs</h3>

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                    </td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td>
                      <span className={`status ${blog.published ? "published" : "draft"}`}>
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="blog-actions">
                        <Link to={`/blogs/edit/${blog._id}`} className="btn-edit">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(blog._id)} className="btn-delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard

