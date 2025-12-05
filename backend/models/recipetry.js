// models/recipeTry.js
module.exports = (sequelize, DataTypes) => {
  const RecipeTry = sequelize.define("RecipeTry", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    commentText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  RecipeTry.associate = (models) => {
    RecipeTry.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    RecipeTry.belongsTo(models.Recipe, { foreignKey: "recipeId", as: "recipe" });
  };

  return RecipeTry;
};
