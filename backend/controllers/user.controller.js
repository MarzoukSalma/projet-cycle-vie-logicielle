const db = require("../models");
const { Recipe, Ingredient, RecipeIngredient ,User } = db;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// POST /api/users/register

// controllers/user.controller.js
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    const token = jwt.sign(
      { id: newUser.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

exports.updateUserSettings = async (req, res) => {
  try {
    const user = req.user;
    const {
      username,
      avatarUrl,
      bio,
      currentPassword,
      newPassword,
    } = req.body;

    // Change username
    if (username) {
      user.username = username;
    }

    // Change avatar / bio
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;

    // Change password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Current password is incorrect",
        });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    return res.json({
      message: "Settings updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating settings",
      error: err.message,
    });
  }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,             
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || "1h" }
    );

    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    return res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({
      message: "Error logging in userrrrrr",
      error: err.message,
    });
  }
};

exports.getVisitedUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "bio", "avatarUrl"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//GET /api/recipes/user/:id
exports.getVisitedUserRecipes = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const recipes = await Recipe.findAll({
      where: { userId },
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const totalRecipes = recipes.length;

    const totalLikes = recipes.reduce(
      (sum, recipe) => sum + (recipe.likesCount || 0),
      0
    );

    return res.json({
      totalRecipes,
      totalLikes,
      recipes,
    });
  } catch (err) {
    console.error("Error fetching visited user recipes:", err);
    return res.status(500).json({
      message: "Error fetching user recipes",
    });
  }
};