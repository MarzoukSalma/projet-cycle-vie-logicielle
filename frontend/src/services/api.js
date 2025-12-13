// API Service - Communication with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch user")
    return await response.json()
  } catch (error) {
    console.error("Error fetching current user:", error)
    throw error
  }
}

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)
    if (!response.ok) throw new Error("Failed to fetch user")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const fetchRecipes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/recipes?${queryParams}`)
    if (!response.ok) throw new Error("Failed to fetch recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipes:", error)
    throw error
  }
}

export const getRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`)
    if (!response.ok) throw new Error("Failed to fetch recipe")
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipe:", error)
    throw error
  }
}

export const getUserRecipes = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/user/${userId}`)
    if (!response.ok) throw new Error("Failed to fetch user recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user recipes:", error)
    throw error
  }
}

export const searchRecipesByName = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/search?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search recipes")
    return await response.json()
  } catch (error) {
    console.error("Error searching recipes:", error)
    throw error
  }
}

export const searchRecipesByIngredients = async (ingredientNames) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/search/ingredients`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ingredients: ingredientNames }),
    })
    if (!response.ok) throw new Error("Failed to search recipes by ingredients")
    return await response.json()
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error)
    throw error
  }
}

export const createRecipe = async (recipeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(recipeData),
    })
    if (!response.ok) throw new Error("Failed to create recipe")
    return await response.json()
  } catch (error) {
    console.error("Error creating recipe:", error)
    throw error
  }
}

export const updateRecipe = async (recipeId, recipeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(recipeData),
    })
    if (!response.ok) throw new Error("Failed to update recipe")
    return await response.json()
  } catch (error) {
    console.error("Error updating recipe:", error)
    throw error
  }
}

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete recipe")
    return await response.json()
  } catch (error) {
    console.error("Error deleting recipe:", error)
    throw error
  }
}

export const likeRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to like recipe")
    return await response.json()
  } catch (error) {
    console.error("Error liking recipe:", error)
    throw error
  }
}

export const unlikeRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/like`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to unlike recipe")
    return await response.json()
  } catch (error) {
    console.error("Error unliking recipe:", error)
    throw error
  }
}

export const fetchIngredients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`)
    if (!response.ok) throw new Error("Failed to fetch ingredients")
    return await response.json()
  } catch (error) {
    console.error("Error fetching ingredients:", error)
    throw error
  }
}

export const createIngredient = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    })
    if (!response.ok) throw new Error("Failed to create ingredient")
    return await response.json()
  } catch (error) {
    console.error("Error creating ingredient:", error)
    throw error
  }
}

export const getRecipeTries = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/tries`)
    if (!response.ok) throw new Error("Failed to fetch recipe tries")
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipe tries:", error)
    throw error
  }
}

export const createRecipeTry = async (recipeId, tryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/tries`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tryData),
    })
    if (!response.ok) throw new Error("Failed to create recipe try")
    return await response.json()
  } catch (error) {
    console.error("Error creating recipe try:", error)
    throw error
  }
}

export const updateRecipeTry = async (tryId, tryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-tries/${tryId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(tryData),
    })
    if (!response.ok) throw new Error("Failed to update recipe try")
    return await response.json()
  } catch (error) {
    console.error("Error updating recipe try:", error)
    throw error
  }
}

export const deleteRecipeTry = async (tryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe-tries/${tryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete recipe try")
    return await response.json()
  } catch (error) {
    console.error("Error deleting recipe try:", error)
    throw error
  }
}
