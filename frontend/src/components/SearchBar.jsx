

import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, ChevronDown } from "lucide-react"
import { searchIngredients, fetchIngredients } from "../services/api"
import "../styles/SearchBar.css"

function SearchBar({ onSearch }) {
  const [searchMode, setSearchMode] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false)
  const [ingredientFilter, setIngredientFilter] = useState("")
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  const [filteredIngredients, setFilteredIngredients] = useState([])
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false)

  const dropdownRef = useRef(null)
  const modeDropdownRef = useRef(null)

  useEffect(() => {
    const loadIngredients = async () => {
      // If no filter and dropdown is shown, load all ingredients
      if (showIngredientDropdown && ingredientFilter.trim() === "") {
        try {
          setIsLoadingIngredients(true)
          const allIngredients = await fetchIngredients()
          const available = allIngredients.filter((ing) => !selectedIngredients.includes(ing.name))
          setFilteredIngredients(available)
        } catch (error) {
          console.error("Failed to load all ingredients:", error)
          setFilteredIngredients([])
        } finally {
          setIsLoadingIngredients(false)
        }
        return
      }

      // If there's a filter, search for specific ingredients
      if (ingredientFilter.trim().length < 2) {
        setFilteredIngredients([])
        return
      }

      try {
        setIsLoadingIngredients(true)
        const ingredients = await searchIngredients(ingredientFilter)
        const available = ingredients.filter((ing) => !selectedIngredients.includes(ing.name))
        setFilteredIngredients(available)
      } catch (error) {
        console.error("Failed to load ingredients:", error)
        setFilteredIngredients([])
      } finally {
        setIsLoadingIngredients(false)
      }
    }

    const debounce = setTimeout(() => {
      if (showIngredientDropdown) {
        loadIngredients()
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [ingredientFilter, selectedIngredients, showIngredientDropdown])

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (searchMode === "name") {
      onSearch?.({ type: "name", query: searchQuery })
    } else {
      onSearch?.({ type: "ingredient", ingredients: selectedIngredients })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const addIngredient = (ingredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient.name])
    setIngredientFilter("")
    setShowIngredientDropdown(false)
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
        <button type="button" className="mode-toggle" onClick={() => setShowModeDropdown(!showModeDropdown)}>
          <Filter size={18} />
          <span>{searchMode === "name" ? "By Name" : "By Ingredient"}</span>
          <ChevronDown size={16} />
        </button>

        {showModeDropdown && (
          <div className="mode-dropdown">
            <button
              type="button"
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
              type="button"
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
              <button type="button" className="clear-btn" onClick={clearSearch}>
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
                  <button type="button" onClick={() => removeIngredient(ing)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={
                  selectedIngredients.length > 0 ? "Add more ingredients..." : "Type to search or click to see all..."
                }
                value={ingredientFilter}
                onChange={(e) => {
                  setIngredientFilter(e.target.value)
                  setShowIngredientDropdown(true)
                }}
                onFocus={() => setShowIngredientDropdown(true)}
                className="ingredient-input"
                disabled={isLoadingIngredients}
              />
            </div>

            {showIngredientDropdown && (filteredIngredients.length > 0 || isLoadingIngredients) && (
              <div className="ingredient-dropdown">
                <div className="dropdown-header">
                  <span>{ingredientFilter ? "Search Results" : "All Ingredients"}</span>
                  <span className="count">{filteredIngredients.length}</span>
                </div>
                <div className="ingredient-list">
                  {isLoadingIngredients ? (
                    <div className="loading-state">Loading ingredients...</div>
                  ) : (
                    filteredIngredients.map((ing) => (
                      <button
                        type="button"
                        key={ing.id}
                        className="ingredient-option"
                        onClick={() => addIngredient(ing)}
                      >
                        {ing.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <button type="button" className="clear-btn" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <button type="button" className="search-btn" onClick={handleSearch}>
          <Search size={20} />
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBar
