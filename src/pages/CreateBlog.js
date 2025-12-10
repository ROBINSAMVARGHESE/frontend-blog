"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { createBlog } from "../services/api"
import Alert from "../components/ui/Alert"
import "./BlogForms.css"

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
    published: true,
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [draftSaved, setDraftSaved] = useState(false)

  const navigate = useNavigate()

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft")
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        setFormData(parsedDraft)
        setDraftSaved(true)
      } catch (err) {
        console.error("Error parsing draft:", err)
      }
    }
  }, [])

  // Auto-save draft to localStorage
  useEffect(() => {
    const autoSaveDraft = setTimeout(() => {
      if (formData.title || formData.content || formData.summary) {
        localStorage.setItem("blogDraft", JSON.stringify(formData))
        setDraftSaved(true)
      }
    }, 2000)

    return () => clearTimeout(autoSaveDraft)
  }, [formData])

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.summary) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
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
      }

      const response = await createBlog(blogFormData)

      // Clear draft from localStorage
      localStorage.removeItem("blogDraft")

      // Redirect to the new blog
      navigate(`/blogs/${response.data._id}`)
    } catch (err) {
      setError(err.message || "Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  const clearDraft = () => {
    if (window.confirm("Are you sure you want to clear the draft?")) {
      localStorage.removeItem("blogDraft")
      setFormData({
        title: "",
        content: "",
        summary: "",
        tags: "",
        published: true,
      })
      setImage(null)
      setImagePreview(null)
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

  return (
    <div className="blog-form">
      <div className="blog-form-header">
        <h1>Create New Blog</h1>
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
            Publish immediately (uncheck to save as draft)
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog

