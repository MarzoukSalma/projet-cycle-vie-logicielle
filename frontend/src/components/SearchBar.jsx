import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, ChevronDown } from "lucide-react"
import "../styles/SearchBar.css"

// Mock ingredients list (in a real app, this would come from your database/API)
const ALL_INGREDIENTS = [
  "Tomatoes",
  "Onions",
  "Garlic",
  "Olive Oil",
  "Salt",
  "Pepper",
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Shrimp",
  "Eggs",
  "Milk",
  "Butter",
  "Cheese",
  "Parmesan",
  "Mozzarella",
  "Flour",
  "Sugar",
  "Baking Powder",
  "Yeast",
  "Rice",
  "Pasta",
  "Bread",
  "Potatoes",
  "Carrots",
  "Celery",
  "Bell Peppers",
  "Mushrooms",
  "Spinach",
  "Lettuce",
  "Cucumber",
  "Avocado",
  "Lemon",
  "Lime",
  "Basil",
  "Oregano",
  "Thyme",
  "Rosemary",
  "Cilantro",
  "Parsley",
  "Cumin",
  "Paprika",
  "Cinnamon",
  "Vanilla",
  "Honey",
  "Maple Syrup",
  "Soy Sauce",
  "Vinegar",
  "Mustard",
]

function SearchBar({ onSearch }) {
  const [searchMode, setSearchMode] = useState("name") // 'name' or 'ingredient'
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false)
  const [ingredientFilter, setIngredientFilter] = useState("")
  const [showModeDropdown, setShowModeDropdown] = useState(false)

  const dropdownRef = useRef(null)
  const modeDropdownRef = useRef(null)

  // Filter ingredients based on input
  const filteredIngredients = ALL_INGREDIENTS.filter(
    (ing) => ing.toLowerCase().includes(ingredientFilter.toLowerCase()) && !selectedIngredients.includes(ing),
  )

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowIngredientDropdown(false)
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchMode === "name") {
      onSearch?.({ type: "name", query: searchQuery })
    } else {
      onSearch?.({ type: "ingredient", ingredients: selectedIngredients })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const addIngredient = (ingredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient])
    setIngredientFilter("")
  }

  const removeIngredient = (ingredient) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient))
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedIngredients([])
    setIngredientFilter("")
    onSearch?.({ type: searchMode, query: "", ingredients: [] })
  }

  return (
    <div className="search-bar-container">
      <div className="search-mode-selector" ref={modeDropdownRef}>
        <button className="mode-toggle" onClick={() => setShowModeDropdown(!showModeDropdown)}>
          <Filter size={18} />
          <span>{searchMode === "name" ? "By Name" : "By Ingredient"}</span>
          <ChevronDown size={16} />
        </button>

        {showModeDropdown && (
          <div className="mode-dropdown">
            <button
              className={`mode-option ${searchMode === "name" ? "active" : ""}`}
              onClick={() => {
                setSearchMode("name")
                setShowModeDropdown(false)
                setSelectedIngredients([])
              }}
            >
              Search by Name
              <span className="mode-description">Find recipes by title</span>
            </button>
            <button
              className={`mode-option ${searchMode === "ingredient" ? "active" : ""}`}
              onClick={() => {
                setSearchMode("ingredient")
                setShowModeDropdown(false)
                setSearchQuery("")
              }}
            >
              Search by Ingredient
              <span className="mode-description">Select ingredients you have</span>
            </button>
          </div>
        )}
      </div>

      <div className="search-input-wrapper">
        {searchMode === "name" ? (
          <div className="name-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search recipes by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>
        ) : (
          <div className="ingredient-search" ref={dropdownRef}>
            <div className="selected-ingredients">
              {selectedIngredients.map((ing) => (
                <span key={ing} className="ingredient-tag">
                  {ing}
                  <button onClick={() => removeIngredient(ing)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={
                  selectedIngredients.length > 0 ? "Add more ingredients..." : "Type to search ingredients..."
                }
                value={ingredientFilter}
                onChange={(e) => {
                  setIngredientFilter(e.target.value)
                  setShowIngredientDropdown(true)
                }}
                onFocus={() => setShowIngredientDropdown(true)}
                className="ingredient-input"
              />
            </div>

            {showIngredientDropdown && filteredIngredients.length > 0 && (
              <div className="ingredient-dropdown">
                <div className="dropdown-header">
                  <span>Available Ingredients</span>
                  <span className="count">{filteredIngredients.length}</span>
                </div>
                <div className="ingredient-list">
                  {filteredIngredients.map((ing) => (
                    <button key={ing} className="ingredient-option" onClick={() => addIngredient(ing)}>
                      {ing}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <button className="clear-btn" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <button className="search-btn" onClick={handleSearch}>
          <Search size={20} />
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBar
