"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { fetchBlogById, updateBlog } from "../services/api"
import { API_URL } from "../config"
import Alert from "../components/ui/Alert"
import Spinner from "../components/ui/Spinner"
import "./BlogForms.css"

const EditBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
    published: true,
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [draftSaved, setDraftSaved] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  // Load blog data
  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true)
        const response = await fetchBlogById(id)
        const blog = response.data

        setFormData({
          title: blog.title,
          content: blog.content,
          summary: blog.summary,
          tags: blog.tags ? blog.tags.join(", ") : "",
          published: blog.published,
        })

        if (blog.image) {
          setCurrentImage(blog.image)
        }
      } catch (err) {
        setError(err.message || "Failed to load blog")
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [id])

  // Auto-save draft to localStorage
  useEffect(() => {
    if (loading) return

    const autoSaveDraft = setTimeout(() => {
      if (formData.title || formData.content || formData.summary) {
        localStorage.setItem(`blogEdit_${id}`, JSON.stringify(formData))
        setDraftSaved(true)
      }
    }, 2000)

    return () => clearTimeout(autoSaveDraft)
  }, [formData, id, loading])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setCurrentImage(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    setCurrentImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.summary) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      // Process tags
      const tagsArray = formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : []

      // Create FormData for file upload
      const blogFormData = new FormData()
      blogFormData.append("title", formData.title)
      blogFormData.append("content", formData.content)
      blogFormData.append("summary", formData.summary)
      blogFormData.append("published", formData.published)

      // Add tags as JSON string
      blogFormData.append("tags", JSON.stringify(tagsArray))

      // Add image if selected
      if (image) {
        blogFormData.append("image", image)
      } else if (currentImage === null) {
        // If current image was removed and no new image selected
        blogFormData.append("removeImage", "true")
      }

      await updateBlog(id, blogFormData)

      // Clear draft from localStorage
      localStorage.removeItem(`blogEdit_${id}`)

      // Redirect to the blog
      navigate(`/blogs/${id}`)
    } catch (err) {
      setError(err.message || "Failed to update blog")
    } finally {
      setSubmitting(false)
    }
  }

  const clearDraft = () => {
    if (window.confirm("Are you sure you want to clear the draft?")) {
      localStorage.removeItem(`blogEdit_${id}`)
      setDraftSaved(false)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ]

  if (loading) {
    return (
      <div className="blog-form-loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="blog-form">
      <div className="blog-form-header">
        <h1>Edit Blog</h1>
        {draftSaved && (
          <div className="draft-status">
            <span>Draft saved</span>
            <button onClick={clearDraft} className="btn-clear-draft">
              Clear Draft
            </button>
          </div>
        )}
      </div>

      {error && <Alert type="danger" message={error} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary (max 200 characters) *</label>
          <textarea
            id="summary"
            name="summary"
            className="form-control"
            value={formData.summary}
            onChange={handleChange}
            maxLength={200}
            rows={3}
            required
          ></textarea>
          <small>{formData.summary.length}/200 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Optional. Max size: 5MB. Recommended size: 1200x600px</small>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              <button type="button" className="btn-remove-image" onClick={removeImage}>
                Remove Image
              </button>
            </div>
          )}

          {currentImage && !imagePreview && (
            <div className="image-preview">
              <img src={`${API_URL}${currentImage}`} alt="Current" />
              <button type="button" className="btn-remove-image" onClick={removeImage}>
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-control"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. technology, programming, web"
          />
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="form-check-input"
          />
          <label htmlFor="published" className="form-check-label">
            Published
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/blogs/${id}`)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditBlog

