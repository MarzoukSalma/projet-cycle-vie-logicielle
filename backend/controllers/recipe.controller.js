// controllers/recipe.controller.js
const db = require("../models")
const { Recipe, Ingredient, RecipeIngredient } = db

// Fonction helper pour transformer une recette
const transformRecipe = (recipeJSON) => {
  return {
    id: recipeJSON.id,
    userId: recipeJSON.userId,
    title: recipeJSON.title,
    description: recipeJSON.description,
    imageUrl: recipeJSON.imageUrl,
    steps: recipeJSON.steps,
    prepTimeMinutes: recipeJSON.prepTimeMinutes,
    cookTimeMinutes: recipeJSON.cookTimeMinutes,
    totalTimeMinutes: recipeJSON.totalTimeMinutes,
    likesCount: recipeJSON.likesCount,
    createdAt: recipeJSON.createdAt,
    updatedAt: recipeJSON.updatedAt,
    user: recipeJSON.author,
    commentsCount: recipeJSON.tries?.length || 0,
    RecipeIngredients: recipeJSON.ingredients?.map((ing) => ({
      id: ing.id,
      quantity: ing.RecipeIngredient?.quantity || null,
      Ingredient: {
        id: ing.id,
        name: ing.name,
      },
    })) || [],
  }
}

// GET /api/recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatarUrl", "email"],
        },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
        {
          model: db.RecipeTry,
          as: "tries",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    const transformedRecipes = recipes.map((recipe) => {
      const recipeJSON = recipe.toJSON()
      return transformRecipe(recipeJSON)
    })

    return res.json(transformedRecipes)
  } catch (err) {
    console.error("Error fetching recipes:", err)
    return res.status(500).json({ message: "Error fetching recipes" })
  }
}

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params

    const recipe = await Recipe.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatarUrl", "email"],
        },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: {
            attributes: ["quantity"],
          },
        },
        {
          model: db.RecipeTry,
          as: "tries",
          attributes: ["id"],
        },
      ],
    })

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    const recipeJSON = recipe.toJSON()
    const transformed = transformRecipe(recipeJSON)

    return res.json(transformed)
  } catch (err) {
    console.error("Error fetching recipe:", err)
    return res.status(500).json({ message: "Error fetching recipe" })
  }
}

// POST /api/recipes
exports.createRecipe = async (req, res) => {
  const transaction = await db.sequelize.transaction()

  try {
    const userId = req.user.id
    const { title, description, imageUrl, steps, prepTimeMinutes, cookTimeMinutes, totalTimeMinutes, ingredients } =
      req.body

    if (!title) {
      await transaction.rollback()
      return res.status(400).json({ message: "Title is required" })
    }

    const recipe = await Recipe.create(
      {
        userId,
        title,
        description,
        imageUrl,
        steps,
        prepTimeMinutes,
        cookTimeMinutes,
        totalTimeMinutes,
      },
      { transaction },
    )

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const item of ingredients) {
        let ingredient

        if (item.ingredientId) {
          ingredient = await Ingredient.findByPk(item.ingredientId, { transaction })
          if (!ingredient) {
            throw new Error("Ingredient not found")
          }
        } else if (item.name) {
          const ingredientName = item.name.trim().toLowerCase()
          ;[ingredient] = await Ingredient.findOrCreate({
            where: { name: ingredientName },
            defaults: { name: ingredientName },
            transaction,
          })
        } else {
          throw new Error("Ingredient must have id or name")
        }

        await RecipeIngredient.create(
          {
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            quantity: item.quantity || null,
          },
          { transaction },
        )
      }
    }

    await transaction.commit()

    // Recharger la recette avec toutes les relations
    const createdRecipe = await Recipe.findByPk(recipe.id, {
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatarUrl", "email"],
        },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
        {
          model: db.RecipeTry,
          as: "tries",
          attributes: ["id"],
        },
      ],
    })

    const recipeJSON = createdRecipe.toJSON()
    const transformed = transformRecipe(recipeJSON)

    return res.status(201).json(transformed)
  } catch (err) {
    await transaction.rollback()
    console.error("Error creating recipe:", err)
    return res.status(500).json({
      message: "Error creating recipe",
      error: err.message,
    })
  }
}

// POST /api/recipes/:id/like
exports.likeRecipe = async (req, res) => {
  try {
    const { id } = req.params

    const recipe = await Recipe.findByPk(id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    recipe.likesCount = (recipe.likesCount || 0) + 1
    await recipe.save()

    return res.json({
      message: "Recipe liked successfully",
      likesCount: recipe.likesCount,
    })
  } catch (err) {
    console.error("Error liking recipe:", err)
    return res.status(500).json({ message: "Error liking recipe" })
  }
}

// POST /api/recipes/:id/dislike
exports.dislikeRecipe = async (req, res) => {
  try {
    const { id } = req.params

    const recipe = await Recipe.findByPk(id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    recipe.likesCount = Math.max((recipe.likesCount || 0) - 1, 0)
    await recipe.save()

    return res.json({
      message: "Recipe disliked successfully",
      likesCount: recipe.likesCount,
    })
  } catch (err) {
    console.error("Error disliking recipe:", err)
    return res.status(500).json({ message: "Error disliking recipe" })
  }
}

// PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  const transaction = await db.sequelize.transaction()

  try {
    const userId = req.user.id
    const { id } = req.params
    const { title, description, imageUrl, steps, prepTimeMinutes, cookTimeMinutes, totalTimeMinutes, ingredients } =
      req.body

    const recipe = await Recipe.findByPk(id)
    if (!recipe) {
      await transaction.rollback()
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.userId !== userId) {
      await transaction.rollback()
      return res.status(403).json({ message: "Not your recipe" })
    }

    // Update recipe fields
    if (title) recipe.title = title
    if (description) recipe.description = description
    if (imageUrl) recipe.imageUrl = imageUrl
    if (steps) recipe.steps = steps
    if (prepTimeMinutes !== undefined) recipe.prepTimeMinutes = prepTimeMinutes
    if (cookTimeMinutes !== undefined) recipe.cookTimeMinutes = cookTimeMinutes
    if (totalTimeMinutes !== undefined) recipe.totalTimeMinutes = totalTimeMinutes

    await recipe.save({ transaction })

    // Update ingredients if provided
    if (Array.isArray(ingredients)) {
      await RecipeIngredient.destroy({ where: { recipeId: id }, transaction })

      for (const item of ingredients) {
        let ingredient

        if (item.ingredientId) {
          ingredient = await Ingredient.findByPk(item.ingredientId, { transaction })
          if (!ingredient) {
            throw new Error("Ingredient not found")
          }
        } else if (item.name) {
          const ingredientName = item.name.trim().toLowerCase()
          ;[ingredient] = await Ingredient.findOrCreate({
            where: { name: ingredientName },
            defaults: { name: ingredientName },
            transaction,
          })
        } else {
          throw new Error("Ingredient must have id or name")
        }

        await RecipeIngredient.create(
          {
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            quantity: item.quantity || null,
          },
          { transaction },
        )
      }
    }

    await transaction.commit()

    // Reload the recipe with all relations
    const updatedRecipe = await Recipe.findByPk(recipe.id, {
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatarUrl", "email"],
        },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
        {
          model: db.RecipeTry,
          as: "tries",
          attributes: ["id"],
        },
      ],
    })

    const recipeJSON = updatedRecipe.toJSON()
    const transformed = transformRecipe(recipeJSON)

    return res.json(transformed)
  } catch (err) {
    await transaction.rollback()
    console.error("Error updating recipe:", err)
    return res.status(500).json({
      message: "Error updating recipe",
      error: err.message,
    })
  }
}

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const recipe = await Recipe.findByPk(id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.userId !== userId) {
      return res.status(403).json({ message: "Not your recipe" })
    }

    await recipe.destroy()

    return res.json({ message: "Recipe deleted successfully" })
  } catch (err) {
    console.error("Error deleting recipe:", err)
    return res.status(500).json({ message: "Error deleting recipe" })
  }
}

// GET /api/recipes/my
exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user.id

    const recipes = await Recipe.findAll({
      where: { userId },
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatarUrl", "email"],
        },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
        {
          model: db.RecipeTry,
          as: "tries",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    const transformedRecipes = recipes.map((recipe) => {
      const recipeJSON = recipe.toJSON()
      return transformRecipe(recipeJSON)
    })

    return res.json(transformedRecipes)
  } catch (err) {
    console.error("Error fetching user's recipes:", err)
    return res.status(500).json({
      message: "Error fetching user's recipes",
    })
  }
}
