import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createBlog } from "../services/api";
import Alert from "../components/ui/Alert";
import "./BlogForms.css";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
    published: true,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  const navigate = useNavigate();

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem("blogDraft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setDraftSaved(true);
      } catch (err) {
        console.error("Draft load error:", err);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.summary || formData.content) {
        localStorage.setItem("blogDraft", JSON.stringify(formData));
        setDraftSaved(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  // Image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("content", formData.content);
      fd.append("summary", formData.summary);
      fd.append("tags", formData.tags);
      fd.append("published", formData.published);

      if (image) fd.append("image", image);

      await createBlog(fd);

      localStorage.removeItem("blogDraft");
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  // Clear draft
  const clearDraft = () => {
    if (window.confirm("Clear draft?")) {
      localStorage.removeItem("blogDraft");
      setFormData({
        title: "",
        content: "",
        summary: "",
        tags: "",
        published: true,
      });
      setImage(null);
      setImagePreview(null);
      setDraftSaved(false);
    }
  };

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

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
          <label htmlFor="summary">Summary *</label>
          <textarea
            id="summary"
            name="summary"
            className="form-control"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="btn-remove-image"
                onClick={removeImage}
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-control"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. technology, web, lifestyle"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;

