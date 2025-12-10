"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { fetchUserProfile, fetchBlogs } from "../services/api"
import { useAuth } from "../context/AuthContext"
import BlogCard from "../components/blogs/BlogCard"
import Spinner from "../components/ui/Spinner"
import Alert from "../components/ui/Alert"
import "./Profile.css"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const { id } = useParams()
  const { user, updateProfile } = useAuth()
  const isOwnProfile = user && user.id === id

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)

        // Fetch user profile
        const profileResponse = await fetchUserProfile(id)
        setProfile(profileResponse.user)

        // Set form data if it's the user's own profile
        if (isOwnProfile) {
          setFormData({
            name: profileResponse.user.name,
            bio: profileResponse.user.bio || "",
          })
        }

        // Fetch user's blogs
        const blogsResponse = await fetchBlogs(1, 6, "", id)
        setBlogs(blogsResponse.data)
      } catch (err) {
        setError(err.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [id, isOwnProfile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setUpdateLoading(true)
      setUpdateError(null)

      const success = await updateProfile(formData)

      if (success) {
        setProfile({
          ...profile,
          name: formData.name,
          bio: formData.bio,
        })
        setIsEditing(false)
      }
    } catch (err) {
      setUpdateError(err.message || "Failed to update profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <Spinner />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error || "Profile not found"}</p>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-header">
        {isEditing ? (
          <div className="profile-edit-form">
            <h1>Edit Profile</h1>

            {updateError && <Alert type="danger" message={updateError} />}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>

              <div className="profile-edit-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updateLoading}>
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="profile-info">
              <h1>{profile.name}</h1>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <p className="profile-joined">Joined on {formatDate(profile.createdAt)}</p>
            </div>

            {isOwnProfile && (
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>

      <div className="profile-blogs">
        <h2>Blogs by {profile.name}</h2>

        {blogs.length === 0 ? (
          <div className="profile-blogs-empty">
            <p>No blogs published yet.</p>
          </div>
        ) : (
          <div className="profile-blogs-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

