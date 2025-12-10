"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchBlogById, deleteBlog } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { API_URL } from "../config"
import CommentForm from "../components/comments/CommentForm"
import CommentList from "../components/comments/CommentList"
import Spinner from "../components/ui/Spinner"
import "./BlogDetails.css"

const BlogDetails = () => {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true)
        const response = await fetchBlogById(id)
        setBlog(response.data)
      } catch (err) {
        setError(err.message || "Failed to load blog")
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [id])

  const handleCommentAdded = (newComment) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      comments: [...prevBlog.comments, newComment],
    }))
  }

  const handleCommentDeleted = (commentId) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      comments: prevBlog.comments.filter((comment) => comment._id !== commentId),
    }))
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id)
        navigate("/dashboard")
      } catch (err) {
        alert("Failed to delete blog")
      }
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="blog-details-loading">
        <Spinner />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="blog-details-error">
        <h2>Error</h2>
        <p>{error || "Blog not found"}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="blog-details">
      <article className="blog-content">
        <header className="blog-header">
          <h1>{blog.title}</h1>

          <div className="blog-meta">
            <span className="blog-date">{formatDate(blog.createdAt)}</span>
            <span className="blog-author">
              By <Link to={`/profile/${blog.author._id}`}>{blog.author.name}</Link>
            </span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {user && user.id === blog.author._id && (
            <div className="blog-actions">
              <Link to={`/blogs/edit/${blog._id}`} className="btn btn-primary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </header>

        {blog.image && (
          <div className="blog-featured-image">
            <img src={`${API_URL}${blog.image}`} alt={blog.title} />
          </div>
        )}

        <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </article>

      <section className="blog-comments">
        <CommentForm blogId={blog._id} onCommentAdded={handleCommentAdded} />
        <CommentList comments={blog.comments} onCommentDeleted={handleCommentDeleted} />
      </section>
    </div>
  )
}

export default BlogDetails

