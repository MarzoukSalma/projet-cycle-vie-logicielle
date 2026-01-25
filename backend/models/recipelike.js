module.exports = (sequelize, DataTypes) => {
  const RecipeLike = sequelize.define(
    "RecipeLike",
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "RecipeLikes",
      timestamps: true,
    }
  )

  RecipeLike.associate = (models) => {
    RecipeLike.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    })

    RecipeLike.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      onDelete: "CASCADE",
    })
  }

  return RecipeLike
}
