import { useState, useEffect } from "react"
import RecipeCard from "./RecipeCard"
import { fetchRecipes, likeRecipe, unlikeRecipe } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "../styles/RecipeFeed.css"

function RecipeFeed() {
  const { authVersion } = useAuth()

  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchRecipes()
        setRecipes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load recipes:", err)
        setError("Failed to load recipes")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [authVersion])

  const toggleLike = async (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe) return

    const isCurrentlyLiked = recipe.likedByMe || false

    // ✅ optimistic UI update
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              likedByMe: !isCurrentlyLiked,
              likesCount: isCurrentlyLiked
                ? Math.max(0, (r.likesCount || 0) - 1)
                : (r.likesCount || 0) + 1,
            }
          : r,
      ),
    )

    try {
      const data = isCurrentlyLiked ? await unlikeRecipe(recipeId) : await likeRecipe(recipeId)

      // ✅ sync with backend truth
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                likedByMe: typeof data.likedByMe === "boolean" ? data.likedByMe : !isCurrentlyLiked,
                likesCount: typeof data.likesCount === "number" ? data.likesCount : r.likesCount,
              }
            : r,
        ),
      )
    } catch (err) {
      console.error("Failed to toggle like:", err)

      // ✅ rollback
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                likedByMe: isCurrentlyLiked,
                likesCount: isCurrentlyLiked
                  ? (r.likesCount || 0) + 1
                  : Math.max(0, (r.likesCount || 0) - 1),
              }
            : r,
        ),
      )
    }
  }

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
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleLike={toggleLike}
            />
          ))
        ) : (
          <div className="empty-state">No recipes found</div>
        )}
      </div>
    </section>
  )
}

export default RecipeFeed
