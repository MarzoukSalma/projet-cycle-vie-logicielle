"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Make passwordHash nullable
    await queryInterface.changeColumn("Users", "passwordHash", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2️⃣ Add firebaseUid
    await queryInterface.addColumn("Users", "firebaseUid", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // 3️⃣ Add authProvider
    await queryInterface.addColumn("Users", "authProvider", {
      type: Sequelize.ENUM("local", "google", "facebook"),
      allowNull: false,
      defaultValue: "local",
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback safely
    await queryInterface.removeColumn("Users", "firebaseUid");
    await queryInterface.removeColumn("Users", "authProvider");

    await queryInterface.changeColumn("Users", "passwordHash", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // ⚠️ ENUM cleanup (important for Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_authProvider";'
    );
  },
};