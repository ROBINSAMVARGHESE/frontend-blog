"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { addComment } from "../../services/api"
import "./CommentForm.css"

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await addComment({
        content,
        blogId,
      })

      setContent("")
      onCommentAdded(response.data)
    } catch (err) {
      setError(err.message || "Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="comment-form-login-message">
        Please <a href="/login">login</a> to add a comment.
      </div>
    )
  }

  return (
    <div className="comment-form">
      <h3>Add a Comment</h3>

      {error && <div className="comment-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </div>
  )
}

export default CommentForm

