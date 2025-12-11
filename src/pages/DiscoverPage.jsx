

import { useState } from "react"
import SearchBar from "../components/SearchBar"
import RecipeCard from "../components/RecipeCard"
import "../styles/Discover.css"

// Mock recipe data for search results
const ALL_RECIPES = [
  {
    id: 1,
    author: "Chef Marco",
    authorId: "chef-marco",
    emoji: "👨‍🍳",
    difficulty: "Medium",
    duration: "45 mins",
    image: "/gourmet-fine-dining-dish.jpg",
    title: "Truffle Risotto",
    description: "Authentic Italian risotto with truffle oil and parmesan.",
    ingredients: ["Rice", "Butter", "Parmesan", "Garlic", "Olive Oil", "Mushrooms"],
    likes: 128,
    liked: false,
  },
  {
    id: 2,
    author: "VeganLife",
    authorId: "vegan-life",
    emoji: "🌱",
    difficulty: "Easy",
    duration: "15 mins",
    image: "/vegan-plant-based-meal.jpg",
    title: "Protein Buddha Bowl",
    description: "Delicious plant-based protein bowl with fresh veggies.",
    ingredients: ["Avocado", "Spinach", "Carrots", "Cucumber", "Rice", "Lemon"],
    likes: 92,
    liked: false,
  },
  {
    id: 3,
    author: "HomeChef",
    authorId: "home-chef",
    emoji: "👩‍🍳",
    difficulty: "Easy",
    duration: "25 mins",
    image: "/pasta-carbonara.png",
    title: "Classic Carbonara",
    description: "Creamy pasta carbonara with crispy bacon.",
    ingredients: ["Pasta", "Eggs", "Parmesan", "Pepper", "Garlic"],
    likes: 156,
    liked: false,
  },
  {
    id: 4,
    author: "BreakfastQueen",
    authorId: "breakfast-queen",
    emoji: "🥞",
    difficulty: "Easy",
    duration: "20 mins",
    image: "/fluffy-pancakes.jpg",
    title: "Fluffy Pancakes",
    description: "Light and fluffy pancakes with maple syrup.",
    ingredients: ["Flour", "Eggs", "Milk", "Butter", "Sugar", "Baking Powder", "Maple Syrup"],
    likes: 203,
    liked: false,
  },
  {
    id: 5,
    author: "HealthyEats",
    authorId: "healthy-eats",
    emoji: "🥗",
    difficulty: "Easy",
    duration: "10 mins",
    image: "/healthy-buddha-bowl.jpg",
    title: "Rainbow Salad Bowl",
    description: "Fresh and colorful salad bowl with lemon dressing.",
    ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Carrots", "Avocado", "Lemon", "Olive Oil"],
    likes: 87,
    liked: false,
  },
  {
    id: 6,
    author: "PizzaMaster",
    authorId: "pizza-master",
    emoji: "🍕",
    difficulty: "Medium",
    duration: "40 mins",
    image: "/pizza-margherita.png",
    title: "Pizza Margherita",
    description: "Classic Italian pizza with fresh mozzarella and basil.",
    ingredients: ["Flour", "Yeast", "Tomatoes", "Mozzarella", "Basil", "Olive Oil"],
    likes: 245,
    liked: false,
  },
]

function DiscoverPage() {
  const [recipes, setRecipes] = useState(ALL_RECIPES)
  const [searchResults, setSearchResults] = useState(null)
  const [searchInfo, setSearchInfo] = useState(null)

  const handleSearch = (searchData) => {
    if (searchData.type === "name") {
      if (!searchData.query || searchData.query.trim() === "") {
        setSearchResults(null)
        setSearchInfo(null)
        return
      }
      const query = searchData.query.toLowerCase()
      const results = ALL_RECIPES.filter(
        (recipe) => recipe.title.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query),
      )
      setSearchResults(results)
      setSearchInfo({ type: "name", query: searchData.query })
    } else if (searchData.type === "ingredient") {
      if (!searchData.ingredients || searchData.ingredients.length === 0) {
        setSearchResults(null)
        setSearchInfo(null)
        return
      }
      const results = ALL_RECIPES.filter((recipe) =>
        searchData.ingredients.some((ing) =>
          recipe.ingredients.some((recipeIng) => recipeIng.toLowerCase().includes(ing.toLowerCase())),
        ),
      )
      setSearchResults(results)
      setSearchInfo({ type: "ingredient", ingredients: searchData.ingredients })
    }
  }

  const toggleLike = (id) => {
    const updateRecipes = (list) =>
      list.map((recipe) =>
        recipe.id === id
          ? {
              ...recipe,
              liked: !recipe.liked,
              likes: recipe.liked ? recipe.likes - 1 : recipe.likes + 1,
            }
          : recipe,
      )

    setRecipes(updateRecipes)
    if (searchResults) {
      setSearchResults(updateRecipes(searchResults))
    }
  }

  const displayRecipes = searchResults !== null ? searchResults : recipes

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>Discover Recipes</h1>
        <p>Explore new recipes from our community</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {searchInfo && (
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
