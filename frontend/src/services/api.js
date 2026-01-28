// API Service - Communication with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}


// ✅ Helper pour gérer les erreurs d'authentification
const handleAuthError = async (response) => {
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json()
    
    // Si le token a expiré, déconnecter l'utilisateur
    if (errorData.code === 'TOKEN_EXPIRED' || errorData.message?.includes('expired')) {
      console.warn('🔴 Token expired - logging out')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Rediriger vers la page de connexion
      window.location.href = '/login'
      
      throw new Error('Your session has expired. Please login again.')
    }
    
    throw new Error(errorData.message || 'Authentication failed')
  }
}

// ==================== USER ENDPOINTS ====================
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to login")
    }

    const data = await response.json() // ✅ IMPORTANT

    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}


export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to register")
    }

    const data = await response.json() // ✅ IMPORTANT

    // ✅ SAVE TOKEN + USER
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  } catch (error) {
    console.error("Error registering:", error)
    throw error
  }
}


export const updateUserSettings = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/settings`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    
    // ✅ Vérifier l'expiration du token
    await handleAuthError(response)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update user settings")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error updating user settings:", error)
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

export const getUserRecipes = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/recipes`)
    if (!response.ok) throw new Error("Failed to fetch user recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user recipes:", error)
    throw error
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to send reset email")
    }
    return await response.json()
  } catch (error) {
    console.error("Error sending password reset:", error)
    throw error
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to reset password")
    }
    return await response.json()
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

// ==================== RECIPE ENDPOINTS ====================

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      headers: getAuthHeaders(), // ✅ IMPORTANT
    })
    if (!response.ok) throw new Error("Failed to fetch recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipes:", error)
    throw error
  }
}


export const getMyRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/my`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch my recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching my recipes:", error)
    throw error
  }
}

export const getRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      headers: getAuthHeaders(), // 🔥 THIS WAS MISSING
    })
    if (!response.ok) throw new Error("Failed to fetch recipe")
    return await response.json()
  } catch (error) {
    console.error("Error fetching recipe:", error)
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
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create recipe")
    }
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
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update recipe")
    }
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
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok && data.message !== "Recipe already liked") {
    throw new Error(data.message || "Failed to like recipe")
  }

  // ✅ ALWAYS return backend truth
  return data
}



export const unlikeRecipe = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/dislike`, {
    method: "POST",
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to dislike recipe")
  }

  return data
}

export const getMyLikedRecipes = async () => {
  const response = await fetch(`${API_BASE_URL}/recipes/liked`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch liked recipes")
  return response.json()
}



// ==================== INGREDIENT ENDPOINTS ====================

export const fetchIngredients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients/all`)
    if (!response.ok) throw new Error("Failed to fetch ingredients")
    return await response.json()
  } catch (error) {
    console.error("Error fetching ingredients:", error)
    throw error
  }
}

export const searchIngredients = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search ingredients")
    return await response.json()
  } catch (error) {
    console.error("Error searching ingredients:", error)
    throw error
  }
}

// ==================== RECIPE TRIES ENDPOINTS ====================

export const getRecipeTries = async (recipeId) => {
  try {
    console.log("[v0] Fetching recipe tries for recipeId:", recipeId)
const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/tries`, {
  headers: getAuthHeaders(),
})
     console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response:", errorText)
      throw new Error("Failed to fetch recipe tries")
    }

    const data = await response.json()
    console.log("[v0] Received", data.length, "tries")
    return data
  } catch (error) {
    console.error("Error fetching recipe tries:", error)
    throw error
  }
}

export const createRecipeTry = async (recipeId, tryData) => {
  try {
    console.log("[v0] Creating recipe try for recipeId:", recipeId)
    console.log("[v0] Try data:", { ...tryData, imageUrl: tryData.imageUrl ? "image provided" : "no image" })

    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/try`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tryData),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response:", errorText)
      throw new Error("Failed to create recipe try")
    }

    const data = await response.json()
    console.log("[v0] Created recipe try:", data.id)
    return data
  } catch (error) {
    console.error("Error creating recipe try:", error)
    throw error
  }
}

export const deleteRecipeTry = async (recipeId, tryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/tries/${tryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete comment")
    }
    return await response.json()
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw error
  }
}

// ==================== SEARCH ENDPOINTS ====================

export const globalSearch = async (query) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    console.error("Search error payload:", data)
    throw new Error(data.message || "Failed to search")
  }
  return data
}


export const searchByIngredients = async (ingredients) => {
  try {
    // Create query string with multiple ingredients
    const ingredientQuery = ingredients.join(" ")
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(ingredientQuery)}`)
    if (!response.ok) throw new Error("Failed to search by ingredients")
    return await response.json()
  } catch (error) {
    console.error("Error searching by ingredients:", error)
    throw error
  }
}

// ==================== CHAT ENDPOINTS ====================

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    })
    if (!response.ok) throw new Error("Failed to send chat message")
    return await response.json()
  } catch (error) {
    console.error("Error sending chat message:", error)
    throw error
  }
}

// ==================== STORY ENDPOINTS ====================
export const fetchTopRecipeStories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/stories`, {
      headers: getAuthHeaders(), // authOptional => ok même sans token
    })
    if (!response.ok) throw new Error("Failed to fetch stories recipes")
    return await response.json()
  } catch (error) {
    console.error("Error fetching stories recipes:", error)
    throw error
  }
}
