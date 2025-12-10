"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import BlogCard from "./BlogCard"
import Pagination from "../ui/Pagination"
import Spinner from "../ui/Spinner"
import { fetchBlogs } from "../../services/api"
import "./BlogList.css"

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1,
  })

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetchBlogs(pagination.page, pagination.limit, searchQuery)
        setBlogs(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err.message || "Failed to load blogs")
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [pagination.page, pagination.limit, searchQuery])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo(0, 0)
  }

  if (loading) {
    return (
      <div className="blog-list-loading">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <div className="blog-list-error">Error: {error}</div>
  }

  if (blogs.length === 0) {
    return (
      <div className="blog-list-empty">
        <h2>No blogs found</h2>
        {searchQuery && <p>No results for "{searchQuery}"</p>}
      </div>
    )
  }

  return (
    <div className="blog-list">
      {searchQuery && (
        <div className="blog-list-search-results">
          <h2>Search results for: "{searchQuery}"</h2>
          <p>{pagination.total} results found</p>
        </div>
      )}

      <div className="blog-list-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default BlogList

