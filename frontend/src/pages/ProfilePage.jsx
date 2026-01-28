import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Settings, Grid, Heart, Calendar, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { getUserById, getUserRecipes, deleteRecipe, getMyLikedRecipes } from "../services/api"
import "../styles/Profile.css"

function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const [activeTab, setActiveTab] = useState("recipes")
  const [isFollowing, setIsFollowing] = useState(false)
  const [user, setUser] = useState(null)
  const [userStats, setUserStats] = useState({ totalRecipes: 0, totalLikes: 0 })

  // ✅ Separate lists
  const [myRecipes, setMyRecipes] = useState([])
  const [likedRecipes, setLikedRecipes] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isOwnProfile = !userId || (currentUser && userId == currentUser.id)

  // Load profile + user's recipes (for "recipes" tab)
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const profileUser = userId ? await getUserById(userId) : currentUser

        if (!profileUser || !profileUser.id) {
          throw new Error("User ID is missing")
        }

        setUser(profileUser)

        const recipesData = await getUserRecipes(profileUser.id)

        if (recipesData.recipes) {
          setMyRecipes(recipesData.recipes)
          setUserStats({
            totalRecipes: recipesData.totalRecipes || 0,
            totalLikes: recipesData.totalLikes || 0,
          })
        } else if (Array.isArray(recipesData)) {
          setMyRecipes(recipesData)
          setUserStats({
            totalRecipes: recipesData.length,
            totalLikes: recipesData.reduce((sum, r) => sum + (r.likesCount || 0), 0),
          })
        } else {
          setMyRecipes([])
          setUserStats({ totalRecipes: 0, totalLikes: 0 })
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
    }
  }, [userId, currentUser])

  // Load liked recipes when tab = liked (only for own profile)
  useEffect(() => {
    const loadLiked = async () => {
      if (!isOwnProfile) return
      if (activeTab !== "liked") return

      try {
        const liked = await getMyLikedRecipes()
        setLikedRecipes(Array.isArray(liked) ? liked : [])
      } catch (e) {
        console.error("Failed to load liked recipes:", e)
        setLikedRecipes([])
      }
    }

    loadLiked()
  }, [activeTab, isOwnProfile])

  const displayedRecipes = activeTab === "liked" ? likedRecipes : myRecipes

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  const handleDeleteRecipe = async (e, recipeId) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this recipe?")) return

    try {
      await deleteRecipe(recipeId)
      setMyRecipes((prev) => prev.filter((r) => r.id !== recipeId))
      setUserStats((prev) => ({ ...prev, totalRecipes: Math.max(0, prev.totalRecipes - 1) }))
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
          <button
            className={`tab-btn ${activeTab === "liked" ? "active" : ""}`}
            onClick={() => setActiveTab("liked")}
          >
            <Heart size={18} />
            Liked
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

              {isOwnProfile && activeTab === "recipes" && (
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
            <Heart size={48} />
            <p>{activeTab === "recipes" ? "No recipes yet" : "No liked recipes yet"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
