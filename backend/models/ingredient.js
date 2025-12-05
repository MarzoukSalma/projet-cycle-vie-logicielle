// models/ingredient.js
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define("Ingredient", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // optionnel, si tu veux éviter "Tomate" en double
    },
  });

  Ingredient.associate = (models) => {
    Ingredient.belongsToMany(models.Recipe, {
      through: models.RecipeIngredient,
      foreignKey: "ingredientId",
      otherKey: "recipeId",
      as: "recipes",
    });
  };

  return Ingredient;
};
