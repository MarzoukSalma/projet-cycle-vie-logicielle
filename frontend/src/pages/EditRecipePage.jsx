
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { updateRecipe, fetchIngredients } from "../services/api"
import "../styles/EditRecipe.css"

function EditRecipePage() {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const initialRecipe = location.state?.recipe

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    steps: "",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    ingredients: [],
  })

  const [availableIngredients, setAvailableIngredients] = useState([])
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    // Load available ingredients
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredients()
        setAvailableIngredients(data || [])
      } catch (err) {
        console.error("Failed to load ingredients:", err)
      }
    }

    loadIngredients()
  }, [])

  useEffect(() => {
    if (initialRecipe) {
      // Parse ingredients from RecipeIngredients
      const ingredients = (initialRecipe.RecipeIngredients || []).map((item) => ({
        name: item.Ingredient?.name || "",
        quantity: item.quantity || "",
      }))

      // Parse steps
      let steps = ""
      if (initialRecipe.steps) {
        try {
          const parsedSteps = JSON.parse(initialRecipe.steps)
          steps = Array.isArray(parsedSteps) ? parsedSteps.join("\n") : initialRecipe.steps
        } catch {
          steps = initialRecipe.steps
        }
      }

      setFormData({
        title: initialRecipe.title || "",
        description: initialRecipe.description || "",
        imageUrl: initialRecipe.imageUrl || "",
        steps: steps || "",
        prepTimeMinutes: initialRecipe.prepTimeMinutes || 0,
        cookTimeMinutes: initialRecipe.cookTimeMinutes || 0,
        ingredients: ingredients,
      })
    }
  }, [initialRecipe])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Time") ? parseInt(value) || 0 : value,
    }))
    setError(null)
  }

  const handleAddIngredient = () => {
    if (!newIngredientName.trim()) {
      setError("Ingredient name is required")
      return
    }

    const newIngredient = {
      name: newIngredientName.trim(),
      quantity: newIngredientQuantity.trim(),
    }

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }))

    setNewIngredientName("")
    setNewIngredientQuantity("")
  }

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.title.trim()) {
      setError("Recipe title is required")
      setIsLoading(false)
      return
    }

    try {
      // Parse steps into array
      const stepsArray = formData.steps
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const updateData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        steps: JSON.stringify(stepsArray),
        prepTimeMinutes: formData.prepTimeMinutes,
        cookTimeMinutes: formData.cookTimeMinutes,
        ingredients: formData.ingredients,
      }

      await updateRecipe(recipeId, updateData)
      setSuccessMessage("Recipe updated successfully!")

      setTimeout(() => {
        navigate(`/recipe/${recipeId}`)
      }, 1500)
    } catch (err) {
      console.error("Failed to update recipe:", err)
      setError(err.message || "Failed to update recipe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="edit-recipe-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="edit-recipe-container">
        <h1>Edit Recipe</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="edit-recipe-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter recipe title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter recipe description"
              rows="4"
            />
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="Enter recipe image URL"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl || "/placeholder.svg"} alt="Recipe preview" onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }} />
              </div>
            )}
          </div>

          {/* Time fields */}
          <div className="time-fields">
            <div className="form-group">
              <label htmlFor="prepTimeMinutes">Prep Time (minutes)</label>
              <input
                type="number"
                id="prepTimeMinutes"
                name="prepTimeMinutes"
                value={formData.prepTimeMinutes}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cookTimeMinutes">Cook Time (minutes)</label>
              <input
                type="number"
                id="cookTimeMinutes"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label>Ingredients</label>
            <div className="ingredients-input">
              <input
                type="text"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                placeholder="Ingredient name"
              />
              <input
                type="text"
                value={newIngredientQuantity}
                onChange={(e) => setNewIngredientQuantity(e.target.value)}
                placeholder="Quantity (e.g., 2 cups)"
              />
              <button
                type="button"
                className="add-ingredient-btn"
                onClick={handleAddIngredient}
              >
                <Plus size={20} />
              </button>
            </div>

            {formData.ingredients.length > 0 && (
              <div className="ingredients-list">
                {formData.ingredients.map((ing, index) => (
                  <div key={index} className="ingredient-tag">
                    <div className="ingredient-info">
                      <span className="ingredient-quantity">{ing.quantity}</span>
                      <span className="ingredient-name">{ing.name}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-ingredient-btn"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="form-group">
            <label htmlFor="steps">Instructions *</label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="Enter each step on a new line"
              rows="8"
              required
            />
          </div>

          {/* Submit buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecipePage
