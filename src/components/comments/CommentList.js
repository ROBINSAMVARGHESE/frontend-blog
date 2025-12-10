"use client"
import { useAuth } from "../../context/AuthContext"
import { deleteComment } from "../../services/api"
import "./CommentList.css"

const CommentList = ({ comments, onCommentDeleted }) => {
  const { user } = useAuth()

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId)
        onCommentDeleted(commentId)
      } catch (error) {
        console.error("Failed to delete comment:", error)
        alert("Failed to delete comment")
      }
    }
  }

  if (!comments || comments.length === 0) {
    return <div className="comment-list-empty">No comments yet. Be the first to comment!</div>
  }

  return (
    <div className="comment-list">
      <h3>
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>

      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-header">
            <div className="comment-author">{comment.user.name}</div>
            <div className="comment-date">{formatDate(comment.createdAt)}</div>
          </div>

          <div className="comment-content">{comment.content}</div>

          {user && user.id === comment.user._id && (
            <button className="comment-delete-btn" onClick={() => handleDelete(comment._id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default CommentList

