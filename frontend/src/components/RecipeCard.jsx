
import { useNavigate } from "react-router-dom"
import { Heart, Clock, ChefHat } from "lucide-react"
import "../styles/RecipeCard.css"

const RecipeCard = ({ recipe, onToggleLike }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    if (onToggleLike) {
      onToggleLike(recipe.id)
    }
  }

  return (
    <article className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-image-container">
        <img
          src={recipe.imageUrl || "/placeholder-recipe.jpg"}
          alt={recipe.title}
          className="recipe-image"
          onError={(e) => {
            e.target.src = "/placeholder-recipe.jpg"
          }}
        />
        <button
          className={`like-button ${recipe.isLiked ? "liked" : ""}`}
          onClick={handleLikeClick}
          aria-label={recipe.isLiked ? "Unlike recipe" : "Like recipe"}
        >
          <Heart size={20} fill={recipe.isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">
          {recipe.description?.substring(0, 120)}
          {recipe.description?.length > 120 ? "..." : ""}
        </p>

        <div className="recipe-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>{recipe.totalTimeMinutes || recipe.cookTimeMinutes || 0} min</span>
          </div>
          <div className="meta-item">
            <ChefHat size={16} />
            <span>{recipe.userName || "Anonymous"}</span>
          </div>
          <div className="meta-item">
            <Heart size={16} />
            <span>{recipe.likesCount || 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
