// models/recipe.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define("Recipe", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    steps: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prepTimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cookTimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalTimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  Recipe.associate = (models) => {
    // ⚠️ Assure-toi que ces 3 models existent bien dans /models et sont bien exportés
    Recipe.belongsTo(models.User, { foreignKey: "userId", as: "author" });

    Recipe.hasMany(models.RecipeTry, {
      foreignKey: "recipeId",
      as: "tries",
      onDelete: "CASCADE",
    });

    Recipe.belongsToMany(models.Ingredient, {
      through: models.RecipeIngredient,
      foreignKey: "recipeId",
      otherKey: "ingredientId",
      as: "ingredients",
    });
  };

  return Recipe;
};
