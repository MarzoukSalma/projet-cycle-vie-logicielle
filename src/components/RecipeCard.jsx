"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import "../styles/RecipeCard.css"

function RecipeCard({ recipe, onToggleLike }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div className="author-info">
          <span className="author-emoji">{recipe.emoji}</span>
          <div className="author-details">
            <h3 className="author-name">{recipe.author}</h3>
            <p className="recipe-meta">
              {recipe.difficulty} • {recipe.duration}
            </p>
          </div>
        </div>
      </div>

      <img src={recipe.image || "/placeholder.svg"} alt="Recipe" className="recipe-image" />

      <div className="recipe-actions">
        <button className={`action-btn ${recipe.liked ? "liked" : ""}`} onClick={() => onToggleLike(recipe.id)}>
          <Heart size={24} fill={recipe.liked ? "currentColor" : "none"} />
        </button>
        <button className="action-btn">
          <MessageCircle size={24} />
        </button>
        <button className="action-btn">
          <Share2 size={24} />
        </button>
        <button
          className={`action-btn ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="recipe-info">
        <p className="likes-count">{recipe.likes} likes</p>
        <p className="recipe-description">{recipe.description}</p>
      </div>
    </div>
  )
}

export default RecipeCard
