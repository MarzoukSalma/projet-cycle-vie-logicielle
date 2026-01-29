// backend/index.js
require("dotenv").config()

const app = require("./app")
const db = require("./models")

const PORT = process.env.PORT || 5000

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected")
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err)
  })
