// API Service - Communication with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipes:", error)
    throw error
  }
}

export const createRecipe = async (recipeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    })
    return await response.json()
  } catch (error) {
    console.error("Error creating recipe:", error)
    throw error
  }
}

export const likeRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/like`, {
      method: "POST",
    })
    return await response.json()
  } catch (error) {
    console.error("Error liking recipe:", error)
    throw error
  }
}
