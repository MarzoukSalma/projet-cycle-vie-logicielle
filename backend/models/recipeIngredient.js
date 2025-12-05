// models/recipeIngredient.js
module.exports = (sequelize, DataTypes) => {
  const RecipeIngredient = sequelize.define("RecipeIngredient", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ingredientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true, // "2 cups", "1 tbsp", "200g"
    },
  });

  return RecipeIngredient;
};
