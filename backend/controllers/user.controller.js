const db = require("../models");
const { User } = db;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, avatarUrl, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      avatarUrl,
      bio,
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser.toJSON();

    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
    });

    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};
// POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    // find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || "dev-secret-change-me",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
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
      message: "Error logging in user",
      error: err.message,
    });
  }
};
