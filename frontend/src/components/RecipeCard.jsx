

import { useState, useEffect } from "react"
import RecipeCard from "./RecipeCard"
import { fetchRecipes, likeRecipe, unlikeRecipe } from "../services/api"
import "../styles/RecipeFeed.css"

console.log("[v0] RecipeFeed component loaded")

function RecipeFeed() {
  console.log("[v0] RecipeFeed rendering")
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("[v0] RecipeFeed useEffect running")
    const loadRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("[v0] Fetching recipes...")
        const data = await fetchRecipes({ limit: 10, sort: "createdAt", order: "DESC" })
        console.log("[v0] Recipes fetched:", data)
        setRecipes(data)
      } catch (err) {
        console.error("[v0] Failed to load recipes:", err)
        setError("Failed to load recipes")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const toggleLike = async (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe) return

    const isCurrentlyLiked = recipe.isLiked || false

    try {
      if (isCurrentlyLiked) {
        await unlikeRecipe(recipeId)
      } else {
        await likeRecipe(recipeId)
      }

      // Update local state
      setRecipes(
        recipes.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                isLiked: !isCurrentlyLiked,
                likesCount: isCurrentlyLiked ? r.likesCount - 1 : r.likesCount + 1,
              }
            : r,
        ),
      )
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  console.log("[v0] RecipeFeed state - isLoading:", isLoading, "error:", error, "recipes count:", recipes.length)

  if (isLoading) {
    return (
      <section className="recipe-feed">
        <h2 className="section-title">Latest Recipes</h2>
        <div className="loading-state">Loading recipes...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="recipe-feed">
        <h2 className="section-title">Latest Recipes</h2>
        <div className="error-state">{error}</div>
      </section>
    )
  }

  return (
    <section className="recipe-feed">
      <h2 className="section-title">Latest Recipes</h2>
      <div className="recipes-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} onToggleLike={toggleLike} />)
        ) : (
          <div className="empty-state">No recipes found</div>
        )}
      </div>
    </section>
  )
}

export default RecipeFeed
