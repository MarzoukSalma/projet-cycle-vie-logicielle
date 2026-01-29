const db = require("../models");
const { Recipe, Ingredient, RecipeIngredient, User, RecipeLike } = db;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require('../config/firebase-admin');
const { sendResetPasswordEmail } = require("../utils/sendEmail");
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

// ✅ CORRIGÉ: Charger l'utilisateur depuis la DB
exports.updateUserSettings = async (req, res) => {
  try {
    console.log("📝 updateUserSettings - req.user:", req.user);
    console.log("📝 updateUserSettings - req.body:", req.body);

    // ✅ Récupérer l'ID depuis le JWT décodé
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing from token",
      });
    }

    // ✅ Charger l'utilisateur complet depuis la base de données
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      username,
      avatarUrl,
      bio,
      currentPassword,
      newPassword,
    } = req.body;

    // Change username
    if (username && username !== user.username) {
      // Vérifier que le nouveau username n'est pas déjà pris
      const existingUser = await User.findOne({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          message: "Username already taken",
        });
      }
      
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

    // ✅ Sauvegarder les modifications
    await user.save();

    // ✅ Retourner l'utilisateur sans le mot de passe
    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    console.log("✅ User updated successfully:", userWithoutPassword);

    return res.json({
      message: "Settings updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("❌ Error updating settings:", err);
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
    const { id: userId } = req.params

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
    })

    const totalRecipes = recipes.length
    const recipeIds = recipes.map((r) => r.id)

    // ✅ Likes count map (ONE QUERY)
    const likesCountMap = {}

    if (recipeIds.length > 0) {
      const allLikes = await RecipeLike.findAll({
        where: { recipeId: recipeIds },
        attributes: [
          "recipeId",
          [db.sequelize.fn("COUNT", db.sequelize.col("recipeId")), "count"],
        ],
        group: ["recipeId"],
        raw: true,
      })

      allLikes.forEach((row) => {
        likesCountMap[row.recipeId] = parseInt(row.count, 10)
      })
    }

    // ✅ attach likesCount to each recipe
    const recipesWithLikes = recipes.map((r) => {
      const json = r.toJSON()
      return {
        ...json,
        likesCount: likesCountMap[json.id] || 0,
      }
    })

    const totalLikes = recipesWithLikes.reduce((sum, r) => sum + (r.likesCount || 0), 0)

    return res.json({
      totalRecipes,
      totalLikes,
      recipes: recipesWithLikes,
    })
  } catch (err) {
    console.error("Error fetching visited user recipes:", err)
    return res.status(500).json({ message: "Error fetching user recipes" })
  }
}


// POST /api/users/forgot-password


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        message:
          "If a user with that email exists, a password reset link has been sent",
      });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.json({
      message: "Password reset link has been sent to your email",
    });
  } catch (err) {
    console.error("Error in forgot password:", err);
    return res.status(500).json({
      message: "Error processing password reset request",
      error: err.message,
    });
  }
};


// POST /api/users/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      })
    }

    // Verify the reset token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired reset token" })
    }

    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Hash and update the password
    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()

    return res.json({
      message: "Password has been reset successfully",
    })
  } catch (err) {
    console.error("Error resetting password:", err)
    return res.status(500).json({
      message: "Error resetting password",
      error: err.message,
    })
  }
}
exports.googleAuth = async (req, res) => {
  try {
    const { idToken, email, displayName, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const firebaseUid = decodedToken.uid;
    console.log('✅ Token verified for Firebase UID:', firebaseUid);

    // Check if user exists by firebaseUid
    let user = await User.findOne({ where: { firebaseUid } });

    if (!user) {
      // Check if email already exists (user registered with email/password)
      const existingUser = await User.findOne({ where: { email: email || decodedToken.email } });
      
      if (existingUser) {
        // Link existing account with Google
        existingUser.firebaseUid = firebaseUid;
        existingUser.authProvider = 'google';
        existingUser.avatarUrl = photoURL || decodedToken.picture || existingUser.avatarUrl;
        await existingUser.save();
        user = existingUser;
        console.log('✅ Linked existing user with Google:', user.id);
      } else {
        // Create new user
        const username = (displayName || decodedToken.name || email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000);
        
        user = await User.create({
          email: email || decodedToken.email,
          username: username,
          firebaseUid: firebaseUid,
          authProvider: 'google',
          avatarUrl: photoURL || decodedToken.picture,
          passwordHash: null, // No password for Google users
        });
        console.log('✅ New Google user created:', user.id);
      }
    } else {
      console.log('✅ Existing Google user found:', user.id);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    return res.json({
      message: 'Google authentication successful',
      token,
      user: userWithoutPassword,
    });

  } catch (err) {
    console.error('❌ Google auth error:', err);
    return res.status(500).json({
      message: 'Error during Google authentication',
      error: err.message,
    });
  }
};