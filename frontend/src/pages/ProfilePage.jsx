

import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Settings, Grid, Bookmark, Heart, MapPin, Calendar, LinkIcon, Edit2 } from "lucide-react"
import "../styles/Profile.css"

// Mock data for demonstration
const mockCurrentUser = {
  id: "current-user",
  name: "John Doe",
  username: "@johndoe",
  avatar: "/chef-portrait.png",
  bio: "Passionate home cook sharing my culinary adventures. Love experimenting with flavors from around the world.",
  location: "New York, USA",
  website: "johndoe.recipes",
  joinDate: "January 2023",
  following: 245,
  followers: 1234,
  recipes: [
    {
      id: 1,
      image: "/pasta-carbonara.png",
      title: "Creamy Pasta Carbonara",
      likes: 342,
      author: "John Doe",
      emoji: "😋",
      difficulty: "Easy",
      duration: "25 mins",
      description: "Family recipe passed down for generations with creamy egg sauce.",
      ingredients: [
        { name: "Spaghetti", amount: "400", unit: "g" },
        { name: "Eggs", amount: "4", unit: "pieces" },
      ],
      instructions: ["Cook pasta in salted boiling water.", "Drain pasta and mix with pancetta."],
    },
    {
      id: 2,
      image: "/pizza-margherita.png",
      title: "Pizza Margherita",
      likes: 521,
      author: "John Doe",
      emoji: "😋",
      difficulty: "Medium",
      duration: "45 mins",
      description: "Classic Italian pizza with fresh mozzarella and basil.",
      ingredients: [],
      instructions: [],
    },
    {
      id: 3,
      image: "/healthy-buddha-bowl.jpg",
      title: "Buddha Bowl",
      likes: 189,
      author: "John Doe",
      emoji: "😋",
      difficulty: "Easy",
      duration: "20 mins",
      description: "Healthy and nutritious Buddha bowl with quinoa.",
      ingredients: [],
      instructions: [],
    },
    {
      id: 4,
      image: "/fluffy-pancakes.jpg",
      title: "Fluffy Pancakes",
      likes: 276,
      author: "John Doe",
      emoji: "😋",
      difficulty: "Easy",
      duration: "15 mins",
      description: "Perfect fluffy pancakes for breakfast.",
      ingredients: [],
      instructions: [],
    },
  ],
  savedRecipes: [
    {
      id: 5,
      image: "/vegan-plant-based-meal.jpg",
      title: "Vegan Delight",
      likes: 412,
    },
    {
      id: 6,
      image: "/gourmet-fine-dining-dish.jpg",
      title: "Gourmet Steak",
      likes: 678,
    },
  ],
}

const mockOtherUser = {
  id: "other-user",
  name: "Jane Smith",
  username: "@janesmith",
  avatar: "/female-chef-portrait.png",
  bio: "Professional pastry chef with 10 years of experience. Specializing in French desserts and artisan breads.",
  location: "Paris, France",
  website: "janesmith.bakes",
  joinDate: "March 2022",
  following: 156,
  followers: 5678,
  recipes: [
    {
      id: 7,
      image: "/golden-croissant.png",
      title: "Butter Croissants",
      likes: 892,
      author: "Jane Smith",
      emoji: "👩‍🍳",
      difficulty: "Hard",
      duration: "3 hours",
      description: "Authentic French butter croissants with flaky layers.",
      ingredients: [],
      instructions: [],
    },
    {
      id: 8,
      image: "/decadent-chocolate-cake.png",
      title: "Chocolate Lava Cake",
      likes: 1243,
      author: "Jane Smith",
      emoji: "👩‍🍳",
      difficulty: "Medium",
      duration: "30 mins",
      description: "Decadent chocolate lava cake with molten center.",
      ingredients: [],
      instructions: [],
    },
    {
      id: 9,
      image: "/colorful-macarons.png",
      title: "French Macarons",
      likes: 756,
      author: "Jane Smith",
      emoji: "👩‍🍳",
      difficulty: "Expert",
      duration: "2 hours",
      description: "Delicate French macarons in various flavors.",
      ingredients: [],
      instructions: [],
    },
  ],
  savedRecipes: [],
}

function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("recipes")
  const [isFollowing, setIsFollowing] = useState(false)

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === "current-user"
  const user = isOwnProfile ? mockCurrentUser : mockOtherUser

  const displayedRecipes = activeTab === "recipes" ? user.recipes : user.savedRecipes

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <img src="/food-photography-background.jpg" alt="Cover" className="cover-image" />
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="profile-avatar" />
            {isOwnProfile && (
              <button className="edit-avatar-btn">
                <Edit2 size={16} />
              </button>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-name-row">
              <div>
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-username">{user.username}</p>
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

            <p className="profile-bio">{user.bio}</p>

            <div className="profile-meta">
              {user.location && (
                <span className="meta-item">
                  <MapPin size={16} />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={`https://${user.website}`}
                  className="meta-item link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon size={16} />
                  {user.website}
                </a>
              )}
              <span className="meta-item">
                <Calendar size={16} />
                Joined {user.joinDate}
              </span>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{user.recipes.length}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.followers.toLocaleString()}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.following}</span>
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
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} />
              <div className="recipe-overlay">
                <span className="recipe-title">{recipe.title}</span>
                <span className="recipe-likes">
                  <Heart size={16} fill="white" />
                  {recipe.likes}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bookmark size={48} />
            <p>No saved recipes yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
