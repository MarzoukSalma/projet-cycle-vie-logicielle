

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera } from "lucide-react"
import "../styles/EditProfile.css"

function EditProfilePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "John Doe",
    username: "johndoe",
    bio: "Passionate home cook sharing my culinary adventures. Love experimenting with flavors from around the world.",
    location: "New York, USA",
    website: "johndoe.recipes",
    avatar: "/chef-portrait.png",
    coverImage: "/food-photography-background.jpg",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (type) => {
    // In a real app, this would open a file picker and upload the image
    alert(`Upload ${type} image functionality would be implemented here`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send data to the backend
    console.log("Saving profile:", formData)
    alert("Profile updated successfully!")
    navigate("/profile")
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Edit Profile</h1>
        <button type="submit" form="edit-profile-form" className="save-btn">
          Save
        </button>
      </div>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="edit-profile-form">
        <div className="image-uploads">
          <div className="cover-image-section">
            <img src={formData.coverImage || "/placeholder.svg"} alt="Cover" className="cover-preview" />
            <button type="button" className="change-image-btn" onClick={() => handleImageUpload("cover")}>
              <Camera size={20} />
              Change Cover
            </button>
          </div>

          <div className="avatar-section">
            <img src={formData.avatar || "/placeholder.svg"} alt="Avatar" className="avatar-preview" />
            <button type="button" className="change-avatar-btn" onClick={() => handleImageUpload("avatar")}>
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="yourwebsite.com"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage
