

import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import RecipeCard from "../components/RecipeCard"
import {
  fetchRecipes,
  searchRecipesByName,
  searchRecipesByIngredients,
  likeRecipe,
  unlikeRecipe,
} from "../services/api"
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
        const results = await searchRecipesByName(searchData.query)
        setSearchResults(results)
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
        const results = await searchRecipesByIngredients(searchData.ingredients)
        setSearchResults(results)
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

  const toggleLike = async (recipeId) => {
    // Find the recipe in current display
    const currentList = searchResults !== null ? searchResults : recipes
    const recipe = currentList.find((r) => r.id === recipeId)

    if (!recipe) return

    const isCurrentlyLiked = recipe.isLiked || false

    try {
      if (isCurrentlyLiked) {
        await unlikeRecipe(recipeId)
      } else {
        await likeRecipe(recipeId)
      }

      // Update local state optimistically
      const updateRecipes = (list) =>
        list.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                isLiked: !isCurrentlyLiked,
                likesCount: isCurrentlyLiked ? r.likesCount - 1 : r.likesCount + 1,
              }
            : r,
        )

      setRecipes(updateRecipes)
      if (searchResults) {
        setSearchResults(updateRecipes(searchResults))
      }
    } catch (err) {
      console.error("Failed to toggle like:", err)
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
