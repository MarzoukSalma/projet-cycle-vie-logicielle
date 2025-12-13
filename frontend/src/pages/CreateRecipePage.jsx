

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, X, Clock, Users, ChefHat, ImageIcon } from "lucide-react"
import { createRecipe } from "../services/api"
import "../styles/CreateRecipe.css"

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard", "Expert"]
const CATEGORY_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer", "Beverage"]

function CreateRecipePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    ingredients: [{ name: "", quantity: "" }],
    instructions: [""],
    tags: [],
  })

  const [errors, setErrors] = useState({})
  const [tagInput, setTagInput] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index][field] = value
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }))
  }

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, ingredients: newIngredients }))
    }
  }

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions]
    newInstructions[index] = value
    setFormData((prev) => ({ ...prev, instructions: newInstructions }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, instructions: newInstructions }))
    }
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"

    const hasValidIngredient = formData.ingredients.some((ing) => ing.name.trim())
    if (!hasValidIngredient) newErrors.ingredients = "At least one ingredient is required"

    const hasValidInstruction = formData.instructions.some((inst) => inst.trim())
    if (!hasValidInstruction) newErrors.instructions = "At least one instruction is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const recipeData = {
        title: formData.title,
        description: formData.description,
        imageUrl: previewImage, // TODO: Upload image to storage service
        steps: JSON.stringify(formData.instructions.filter((i) => i.trim())),
        prepTimeMinutes: formData.prepTime ? Number.parseInt(formData.prepTime) : null,
        cookTimeMinutes: formData.cookTime ? Number.parseInt(formData.cookTime) : null,
        totalTimeMinutes:
          formData.prepTime && formData.cookTime
            ? Number.parseInt(formData.prepTime) + Number.parseInt(formData.cookTime)
            : null,
        ingredients: formData.ingredients
          .filter((ing) => ing.name.trim())
          .map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
          })),
      }

      const newRecipe = await createRecipe(recipeData)
      navigate(`/recipe/${newRecipe.id}`)
    } catch (err) {
      console.error("Failed to create recipe:", err)
      setErrors({ submit: "Failed to create recipe. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-header">
        <h1>Create New Recipe</h1>
        <p>Share your culinary creation with the community</p>
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="image-upload-section">
            <label className="image-upload">
              {previewImage ? (
                <img src={previewImage || "/placeholder.svg"} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <ImageIcon size={48} />
                  <span>Click to upload recipe image</span>
                  <span className="upload-hint">JPG, PNG up to 5MB</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            {previewImage && (
              <button type="button" className="remove-image-btn" onClick={() => setPreviewImage(null)}>
                <X size={16} />
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Recipe Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Grandma's Apple Pie"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us about your recipe..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row three-cols">
            <div className="form-group">
              <label htmlFor="prepTime">
                <Clock size={16} />
                Prep Time (min)
              </label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                placeholder="30"
                value={formData.prepTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cookTime">
                <ChefHat size={16} />
                Cook Time (min)
              </label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                placeholder="45"
                value={formData.cookTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="servings">
                <Users size={16} />
                Servings
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                placeholder="4"
                value={formData.servings}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Ingredients</h2>
          {errors.ingredients && <span className="error-message section-error">{errors.ingredients}</span>}

          <div className="ingredients-list">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Quantity (2 cups, 1 tbsp, etc.)"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                  className="quantity-input"
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  className="name-input"
                  style={{ flex: 2 }}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length === 1}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-btn" onClick={addIngredient}>
            <Plus size={18} />
            Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>
          {errors.instructions && <span className="error-message section-error">{errors.instructions}</span>}

          <div className="instructions-list">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <span className="step-number">{index + 1}</span>
                <textarea
                  placeholder={`Step ${index + 1}: Describe what to do...`}
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  rows={2}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeInstruction(index)}
                  disabled={formData.instructions.length === 1}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-btn" onClick={addInstruction}>
            <Plus size={18} />
            Add Step
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateRecipePage
