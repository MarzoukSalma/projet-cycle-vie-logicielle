
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Settings, Grid, Bookmark, Heart, Calendar, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { getUserById, getUserRecipes, deleteRecipe } from "../services/api"
import "../styles/Profile.css"

function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("recipes")
  const [isFollowing, setIsFollowing] = useState(false)
  const [user, setUser] = useState(null)
  const [userStats, setUserStats] = useState({ totalRecipes: 0, totalLikes: 0 })
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isOwnProfile = !userId || (currentUser && userId == currentUser.id)

  useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 🔍 DEBUG: Vérifions les valeurs
      console.log("=== ProfilePage Debug ===")
      console.log("userId from params:", userId)
      console.log("currentUser:", currentUser)
      console.log("currentUser?.id:", currentUser?.id)
      console.log("isOwnProfile:", isOwnProfile)

      // Load user profile
      const profileUser = userId ? await getUserById(userId) : currentUser
      
      console.log("profileUser:", profileUser)
      console.log("profileUser?.id:", profileUser?.id)

      if (!profileUser || !profileUser.id) {
        throw new Error("User ID is missing")
      }

      setUser(profileUser)

      // Load user recipes
      const recipesData = await getUserRecipes(profileUser.id)

      // Check if response has recipes array or is the array itself
      if (recipesData.recipes) {
        setRecipes(recipesData.recipes)
        setUserStats({
          totalRecipes: recipesData.totalRecipes || 0,
          totalLikes: recipesData.totalLikes || 0,
        })
      } else if (Array.isArray(recipesData)) {
        setRecipes(recipesData)
        setUserStats({
          totalRecipes: recipesData.length,
          totalLikes: recipesData.reduce((sum, r) => sum + (r.likesCount || 0), 0),
        })
      }
    } catch (err) {
      console.error("Failed to load profile:", err)
      setError("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (currentUser || userId) {
    loadData()
  } else {
    console.log("⚠️ No currentUser and no userId - cannot load profile")
  }
}, [userId, currentUser])
  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  const handleDeleteRecipe = async (e, recipeId) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this recipe?")) return

    try {
      await deleteRecipe(recipeId)
      setRecipes(recipes.filter((r) => r.id !== recipeId))
      setUserStats({ ...userStats, totalRecipes: userStats.totalRecipes - 1 })
    } catch (err) {
      console.error("Failed to delete recipe:", err)
      alert("Failed to delete recipe. Please try again.")
    }
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
        <div className="profile-info">
          <div className="avatar-section">
            <img
              src={user.avatarUrl || "/placeholder.svg"}
              alt={user.username}
              className="profile-avatar"
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
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
                <span className="stat-value">{userStats.totalRecipes}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userStats.totalLikes}</span>
                <span className="stat-label">Total Likes</span>
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
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-grid-item"
              onClick={() => handleRecipeClick(recipe)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <img
                src={recipe.imageUrl || "/placeholder.svg"}
                alt={recipe.title}
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }}
              />
              <div className="recipe-overlay">
                <span className="recipe-title">{recipe.title}</span>
                <span className="recipe-likes">
                  <Heart size={16} fill="white" />
                  {recipe.likesCount || 0}
                </span>
              </div>
              {isOwnProfile && (
                <button
                  className="recipe-delete-btn"
                  onClick={(e) => handleDeleteRecipe(e, recipe.id)}
                  title="Delete recipe"
                >
                  <Trash2 size={18} />
                </button>
              )}
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
