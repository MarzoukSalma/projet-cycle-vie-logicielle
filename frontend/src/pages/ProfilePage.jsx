

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Settings, Grid, Bookmark, Heart, Calendar, Edit2 } from "lucide-react"
import { getCurrentUser, getUserById, getUserRecipes } from "../services/api"
import "../styles/Profile.css"

function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("recipes")
  const [isFollowing, setIsFollowing] = useState(false)
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const current = await getCurrentUser()
        setCurrentUser(current)

        const profileUser = userId && userId !== current.id ? await getUserById(userId) : current
        setUser(profileUser)

        const userRecipes = await getUserRecipes(profileUser.id)
        setRecipes(userRecipes)

        if (isOwnProfile) {
          setSavedRecipes([])
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
        setError("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  const displayedRecipes = activeTab === "recipes" ? recipes : savedRecipes

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-state">Loading profile...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="profile-page">
        <div className="error-state">{error || "User not found"}</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <img src="/food-photography-background.jpg" alt="Cover" className="cover-image" />
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <img src={user.avatarUrl || "/placeholder.svg"} alt={user.username} className="profile-avatar" />
            {isOwnProfile && (
              <button className="edit-avatar-btn">
                <Edit2 size={16} />
              </button>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-name-row">
              <div>
                <h1 className="profile-name">{user.username}</h1>
                <p className="profile-username">@{user.username}</p>
              </div>
              {isOwnProfile ? (
                <Link to="/edit-profile" className="edit-profile-btn">
                  <Settings size={18} />
                  Edit Profile
                </Link>
              ) : (
                <button
                  className={`follow-btn ${isFollowing ? "following" : ""}`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {user.bio && <p className="profile-bio">{user.bio}</p>}

            <div className="profile-meta">
              <span className="meta-item">
                <Calendar size={16} />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{recipes.length}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => setActiveTab("recipes")}
        >
          <Grid size={18} />
          Recipes
        </button>
        {isOwnProfile && (
          <button className={`tab-btn ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
            <Bookmark size={18} />
            Saved
          </button>
        )}
      </div>

      <div className="profile-recipes-grid">
        {displayedRecipes.length > 0 ? (
          displayedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-grid-item"
              onClick={() => handleRecipeClick(recipe)}
              style={{ cursor: "pointer" }}
            >
              <img src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.title} />
              <div className="recipe-overlay">
                <span className="recipe-title">{recipe.title}</span>
                <span className="recipe-likes">
                  <Heart size={16} fill="white" />
                  {recipe.likesCount}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bookmark size={48} />
            <p>{activeTab === "recipes" ? "No recipes yet" : "No saved recipes yet"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
