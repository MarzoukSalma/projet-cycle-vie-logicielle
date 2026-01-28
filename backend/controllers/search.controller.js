// controllers/search.controller.js
const db = require("../models");
const { Recipe, Ingredient, User, RecipeIngredient } = db;
const { Op } = require("sequelize");

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: "La requête de recherche doit avoir au moins 2 caractères" });
    }

    const raw = q.trim();

    const terms = raw
      .split(/[, ]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    // 1) title/description
    const recipes = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${raw}%` } },
          { description: { [Op.iLike]: `%${raw}%` } },
        ],
      },
      include: [{ model: User, as: "author", attributes: ["id", "username", "avatarUrl"] }],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // 2) ingredients by name
    const ingredients = await Ingredient.findAll({
      where: { name: { [Op.iLike]: `%${raw}%` } },
      order: [["name", "ASC"]],
      limit: 10,
    });

    // 3) recipes that contain ONE ingredient like raw
    const recipesWithIngredient = await Recipe.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          where: { name: { [Op.iLike]: `%${raw}%` } },
          required: true,
          through: { attributes: [] },
        },
        { model: User, as: "author", attributes: ["id", "username", "avatarUrl"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // ✅ 4) recipes that contain ALL selected ingredients
    let recipesWithAllIngredients = [];

    if (terms.length >= 1) {
      // (A) trouver les IDs des ingrédients exactement (case-insensitive)
      const foundIngredients = await Ingredient.findAll({
        where: {
          [Op.or]: terms.map((t) => ({ name: { [Op.iLike]: t } })),
        },
        attributes: ["id", "name"],
        raw: true,
      });

      // si un ingrédient demandé n'existe pas -> aucun résultat
      if (foundIngredients.length !== terms.length) {
        recipesWithAllIngredients = [];
      } else {
        const ingredientIds = foundIngredients.map((i) => i.id);

        // (B) trouver les recipeId qui contiennent TOUS ces ingrédients
        const rows = await RecipeIngredient.findAll({
          where: {
            ingredientId: { [Op.in]: ingredientIds },
          },
          attributes: [
            "recipeId",
            [db.sequelize.fn("COUNT", db.sequelize.fn("DISTINCT", db.sequelize.col("ingredientId"))), "cnt"],
          ],
          group: ["recipeId"],
          having: db.sequelize.literal(`COUNT(DISTINCT("ingredientId")) = ${ingredientIds.length}`),
          raw: true,
        });

        const recipeIds = rows.map((r) => r.recipeId);

        // (C) fetch complet des recettes
        recipesWithAllIngredients = recipeIds.length
          ? await Recipe.findAll({
              where: { id: { [Op.in]: recipeIds } },
              include: [
                { model: User, as: "author", attributes: ["id", "username", "avatarUrl"] },
                { model: Ingredient, as: "ingredients", through: { attributes: [] } },
              ],
              order: [["createdAt", "DESC"]],
              limit: 50,
            })
          : [];
      }
    }

    return res.json({
      recipes,
      ingredients,
      recipesWithIngredient,
      recipesWithAllIngredients,
    });
  } catch (err) {
    console.error("Erreur lors de la recherche globale :", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la recherche",
      error: err.message,
    });
  }
};
