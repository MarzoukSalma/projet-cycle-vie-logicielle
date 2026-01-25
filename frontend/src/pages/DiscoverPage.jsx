
import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import RecipeCard from "../components/RecipeCard"
import { fetchRecipes, globalSearch, searchByIngredients, likeRecipe, unlikeRecipe } from "../services/api"
import "../styles/Discover.css"

function DiscoverPage() {
  const [recipes, setRecipes] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [searchInfo, setSearchInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchRecipes()
        setRecipes(data)
      } catch (err) {
        console.error("Failed to load recipes:", err)
        setError("Failed to load recipes. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const handleSearch = async (searchData) => {
    if (searchData.type === "name") {
      if (!searchData.query || searchData.query.trim() === "") {
        setSearchResults(null)
        setSearchInfo(null)
        return
      }

      try {
        setIsSearching(true)
        const data = await globalSearch(searchData.query)
        const allRecipes = [...(data.recipes || []), ...(data.recipesWithIngredient || [])]
        const uniqueRecipes = Array.from(new Map(allRecipes.map((r) => [r.id, r])).values())
        setSearchResults(uniqueRecipes)
        setSearchInfo({ type: "name", query: searchData.query })
      } catch (err) {
        console.error("Search failed:", err)
        setSearchResults([])
        setSearchInfo({ type: "name", query: searchData.query })
      } finally {
        setIsSearching(false)
      }
    } else if (searchData.type === "ingredient") {
      if (!searchData.ingredients || searchData.ingredients.length === 0) {
        setSearchResults(null)
        setSearchInfo(null)
        return
      }

      try {
        setIsSearching(true)
        // Search for recipes containing the selected ingredients
        const data = await searchByIngredients(searchData.ingredients)
        const recipesWithIngredients = data.recipesWithIngredient || []
        
        // Filter to get recipes that contain at least one of the selected ingredients
        const filteredRecipes = recipesWithIngredients.filter((recipe) => {
          if (!recipe.ingredients || recipe.ingredients.length === 0) return false
          return recipe.ingredients.some((ing) =>
            searchData.ingredients.some((selected) => 
              selected.toLowerCase() === ing.name.toLowerCase()
            ),
          )
        })

        setSearchResults(filteredRecipes)
        setSearchInfo({ type: "ingredient", ingredients: searchData.ingredients })
      } catch (err) {
        console.error("Search failed:", err)
        setSearchResults([])
        setSearchInfo({ type: "ingredient", ingredients: searchData.ingredients })
      } finally {
        setIsSearching(false)
      }
    }
  }

const toggleLike = async (recipeId, isCurrentlyLiked) => {
  // 🔥 Optimistic update (instant UI feedback)
  const optimisticUpdate = (list) =>
    list.map((r) =>
      r.id === recipeId
        ? {
            ...r,
            likedByMe: !isCurrentlyLiked,
            likesCount: r.likesCount + (isCurrentlyLiked ? -1 : 1),
          }
        : r,
    )

  setRecipes((prev) => optimisticUpdate(prev))
  if (searchResults) {
    setSearchResults((prev) => optimisticUpdate(prev))
  }

  try {
    const responseData = isCurrentlyLiked
      ? await unlikeRecipe(recipeId)
      : await likeRecipe(recipeId)

    // ✅ Sync with backend truth
    const syncUpdate = (list) =>
      list.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              likedByMe: responseData.likedByMe,
              likesCount: responseData.likesCount,
            }
          : r,
      )

    setRecipes((prev) => syncUpdate(prev))
    if (searchResults) {
      setSearchResults((prev) => syncUpdate(prev))
    }
  } catch (err) {
    console.error("❌ Failed to toggle like:", err)

    // 🔁 Rollback on error
    const rollback = (list) =>
      list.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              likedByMe: isCurrentlyLiked,
              likesCount: r.likesCount + (isCurrentlyLiked ? 1 : -1),
            }
          : r,
      )

    setRecipes((prev) => rollback(prev))
    if (searchResults) {
      setSearchResults((prev) => rollback(prev))
    }
  }
}

  const displayRecipes = searchResults !== null ? searchResults : recipes

  if (isLoading) {
    return (
      <div className="discover-page">
        <div className="discover-header">
          <h1>Discover Recipes</h1>
          <p>Explore new recipes from our community</p>
        </div>
        <div className="loading-state">
          <p>Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="discover-page">
        <div className="discover-header">
          <h1>Discover Recipes</h1>
          <p>Explore new recipes from our community</p>
        </div>
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>Discover Recipes</h1>
        <p>Explore new recipes from our community</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {isSearching && (
        <div className="loading-state">
          <p>Searching...</p>
        </div>
      )}

      {searchInfo && !isSearching && (
        <div className="search-results-info">
          {searchInfo.type === "name" ? (
            <p>
              Showing results for "<strong>{searchInfo.query}</strong>"
              <span className="results-count">({searchResults?.length || 0} recipes found)</span>
            </p>
          ) : (
            <p>
              Recipes with: <strong>{searchInfo.ingredients.join(", ")}</strong>
              <span className="results-count">({searchResults?.length || 0} recipes found)</span>
            </p>
          )}
          <button
            className="clear-search-btn"
            onClick={() => {
              setSearchResults(null)
              setSearchInfo(null)
            }}
          >
            Clear Search
          </button>
        </div>
      )}

      {displayRecipes.length > 0 ? (
        <div className="discover-grid">
          {displayRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onToggleLike={toggleLike} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No recipes found. Try a different search!</p>
        </div>
      )}
    </div>
  )
}

export default DiscoverPage
