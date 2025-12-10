import { Link } from "react-router-dom"
import { API_URL } from "../../config"
import "./BlogCard.css"

const BlogCard = ({ blog }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="blog-card">
      {blog.image && (
        <div className="blog-card-image">
          <img src={`${API_URL}${blog.image}`} alt={blog.title} className="blog-image" />
        </div>
      )}
      <div className="blog-card-content">
        <h2 className="blog-card-title">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h2>

        <div className="blog-card-meta">
          <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
          <span className="blog-card-author">
            By <Link to={`/profile/${blog.author._id}`}>{blog.author.name}</Link>
          </span>
        </div>

        <p className="blog-card-summary">{blog.summary}</p>

        <div className="blog-card-footer">
          <Link to={`/blogs/${blog._id}`} className="blog-card-read-more">
            Read More
          </Link>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-card-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogCard

