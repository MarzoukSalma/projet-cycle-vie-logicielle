
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { updateUserSettings } from "../services/api"
import "../styles/EditProfile.css"

function EditProfilePage() {
  const navigate = useNavigate()
  const { user: currentUser, updateUser } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        avatarUrl: currentUser.avatarUrl || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [currentUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate password fields
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to change password")
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match")
        return
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters")
        return
      }
    }

    try {
      setIsLoading(true)

      const updateData = {
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      }

      // Only include password fields if user is changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await updateUserSettings(updateData)

      // IMPORTANT: Update auth context with new user data
      if (response.user && typeof response.user === 'object') {
        updateUser(response.user)
      } else {
        console.error("❌ Invalid user object received:", response.user)
      }

      setSuccessMessage("Profile updated successfully!")

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      // ✅ Navigation immédiate ou après un court délai
      setTimeout(() => {
        navigate("/profile")
      }, 1500)
    } catch (err) {
      console.error("Failed to update profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Edit Profile</h1>
        <button type="submit" form="edit-profile-form" className="save-btn" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="edit-profile-form">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="image-uploads">
          <div className="avatar-section">
            <img
              src={avatarPreview || formData.avatarUrl || "/placeholder.svg"}
              alt="Avatar"
              className="avatar-preview"
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
            <button
              type="button"
              className="upload-avatar-btn"
              onClick={triggerAvatarUpload}
              title="Click to upload avatar"
            >
              <Upload size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="@username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatarUrl">Avatar URL</label>
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={4}
              maxLength={200}
            />
            <span className="char-count">{formData.bio.length}/200</span>
          </div>

          <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e5e5e5" }} />

          <h3 style={{ marginBottom: "1rem" }}>Change Password</h3>

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage
