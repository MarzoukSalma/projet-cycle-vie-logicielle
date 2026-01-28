// controllers/recipe.controller.js
const db = require("../models")
const { Recipe, Ingredient, RecipeIngredient, RecipeLike } = db

// Fonction helper pour transformer une recette
const transformRecipe = (recipeJSON, likesCount = 0) => {
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
    likesCount: likesCount, 
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
    const userId = req.user?.id || null

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

    // 🔥 Get liked recipes for this user (ONE QUERY)
    let likedRecipeIds = new Set()

    if (userId) {
      const likes = await db.RecipeLike.findAll({
        where: { userId },
        attributes: ["recipeId"],
      })

      likedRecipeIds = new Set(likes.map(like => like.recipeId))
    }

    // 🔥 Get likes count for all recipes (ONE QUERY)
    const likesCountMap = {}
    const allLikes = await db.RecipeLike.findAll({
      attributes: [
        'recipeId',
        [db.sequelize.fn('COUNT', db.sequelize.col('recipeId')), 'count']
      ],
      group: ['recipeId'],
      raw: true
    })

    allLikes.forEach(like => {
      likesCountMap[like.recipeId] = parseInt(like.count)
    })

    const transformedRecipes = recipes.map(recipe => {
      const recipeJSON = recipe.toJSON()
      const likesCount = likesCountMap[recipeJSON.id] || 0

      return {
        ...transformRecipe(recipeJSON, likesCount),
        likedByMe: userId ? likedRecipeIds.has(recipeJSON.id) : false,
      }
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
    const userId = req.user?.id || null

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
          through: { attributes: ["quantity"] },
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

    // 🔥 Check if THIS user liked THIS recipe
    let likedByMe = false

    if (userId) {
      const like = await db.RecipeLike.findOne({
        where: {
          userId,
          recipeId: recipe.id,
        },
      })

      likedByMe = !!like
    }

    // 🔥 Count likes for this recipe
    const likesCount = await db.RecipeLike.count({
      where: { recipeId: id },
    })

    const recipeJSON = recipe.toJSON()
    const transformed = transformRecipe(recipeJSON, likesCount)

    return res.json({
      ...transformed,
      likedByMe,
    })
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
    const transformed = transformRecipe(recipeJSON, 0) // 🔥 New recipe has 0 likes

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

exports.likeRecipe = async (req, res) => {
  try {
    const userId = req.user.id
    const recipeId = req.params.id

    const recipe = await Recipe.findByPk(recipeId)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    await db.RecipeLike.create({
      userId,
      recipeId,
    })

    const likesCount = await db.RecipeLike.count({
      where: { recipeId },
    })

    return res.json({
      message: "Recipe liked successfully",
      likesCount,
      likedByMe: true,
    })
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const likesCount = await db.RecipeLike.count({
        where: { recipeId: req.params.id },
      })

      return res.status(200).json({
        message: "Recipe already liked",
        likesCount,
        likedByMe: true,
      })
    }

    console.error("Error liking recipe:", err)
    return res.status(500).json({ message: "Error liking recipe" })
  }
}


// POST /api/recipes/:id/dislike
exports.dislikeRecipe = async (req, res) => {
  try {
    const userId = req.user.id
    const recipeId = req.params.id

    // Remove the like
    const deleted = await db.RecipeLike.destroy({
      where: { userId, recipeId },
    })

    // If the recipe was not liked, this is NOT a fatal error
    if (!deleted) {
      const likesCount = await db.RecipeLike.count({
        where: { recipeId },
      })

      return res.status(200).json({
        message: "Recipe not liked yet",
        likesCount,
        likedByMe: false,
      })
    }

    // Recount likes
    const likesCount = await db.RecipeLike.count({
      where: { recipeId },
    })

    return res.json({
      message: "Recipe disliked successfully",
      likesCount,
      likedByMe: false,
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

    // 🔥 Count likes for this recipe
    const likesCount = await db.RecipeLike.count({
      where: { recipeId: id },
    })

    const recipeJSON = updatedRecipe.toJSON()
    const transformed = transformRecipe(recipeJSON, likesCount)

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

    // 🔥 Get likes count for user's recipes (ONE QUERY)
    const recipeIds = recipes.map(r => r.id)
    const likesCountMap = {}
    
    if (recipeIds.length > 0) {
      const allLikes = await db.RecipeLike.findAll({
        where: { recipeId: recipeIds },
        attributes: [
          'recipeId',
          [db.sequelize.fn('COUNT', db.sequelize.col('recipeId')), 'count']
        ],
        group: ['recipeId'],
        raw: true
      })

      allLikes.forEach(like => {
        likesCountMap[like.recipeId] = parseInt(like.count)
      })
    }

    const transformedRecipes = recipes.map((recipe) => {
      const recipeJSON = recipe.toJSON()
      const likesCount = likesCountMap[recipeJSON.id] || 0
      return transformRecipe(recipeJSON, likesCount)
    })

    return res.json(transformedRecipes)
  } catch (err) {
    console.error("Error fetching user's recipes:", err)
    return res.status(500).json({
      message: "Error fetching user's recipes",
    })
  }
}
// GET /api/recipes/liked
// GET /api/recipes/liked
exports.getMyLikedRecipes = async (req, res) => {
  try {
    const userId = req.user.id

    // 1) Likes rows
    const likes = await db.RecipeLike.findAll({
      where: { userId },
      attributes: ["recipeId"],
      raw: true,
    })

    const likedIds = likes.map((l) => l.recipeId)
    if (likedIds.length === 0) return res.json([])

    // 2) Fetch recipes
    const recipes = await db.Recipe.findAll({
      where: { id: likedIds },
      include: [
        { model: db.User, as: "author", attributes: ["id", "username", "avatarUrl", "email"] },
        { model: Ingredient, as: "ingredients", attributes: ["id", "name"], through: { attributes: ["quantity"] } },
        { model: db.RecipeTry, as: "tries", attributes: ["id"] },
      ],
      order: [["createdAt", "DESC"]],
    })

    // 3) likes count for these recipes
    const likesCountMap = {}
    const allLikes = await db.RecipeLike.findAll({
      where: { recipeId: likedIds },
      attributes: [
        "recipeId",
        [db.sequelize.fn("COUNT", db.sequelize.col("recipeId")), "count"],
      ],
      group: ["recipeId"],
      raw: true,
    })

    allLikes.forEach((row) => {
      likesCountMap[row.recipeId] = parseInt(row.count, 10)
    })

    // 4) transform + likedByMe true
    const transformed = recipes.map((r) => {
      const json = r.toJSON()
      const likesCount = likesCountMap[json.id] || 0
      return {
        ...transformRecipe(json, likesCount),
        likedByMe: true,
      }
    })

    return res.json(transformed)
  } catch (err) {
    console.error("Error fetching liked recipes:", err)
    return res.status(500).json({ message: "Error fetching liked recipes" })
  }
}
