// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour authentification obligatoire
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token mal formé' });
    }

    const token = parts[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (verifyErr) {
      console.error('JWT verify error:', verifyErr.message);
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['motDePasse', 'passwordHash'] } });

    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Unexpected auth error:', err);
    return res.status(500).json({ error: 'Erreur serveur auth' });
  }
}

// Middleware d'authentification optionnelle
const authenticateTokenOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['motDePasse', 'passwordHash'] }
      });
      req.user = user || null;
    } catch (err) {
      // invalid token -> treat as anonymous
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      req.user = null
      return next()
    }

    const [type, token] = authHeader.split(" ")
    if (type !== "Bearer" || !token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash", "motDePasse"] },
    })

    req.user = user || null
    next()
  } catch {
    // Invalid token → treat as anonymous
    req.user = null
    next()
  }
}

// Ownership check (unchanged)
const checkOwnership = (req, res, next) => {
  const userId = req.user?.id
  const resourceUserId = req.params.userId || req.params.id

  if (!userId || userId !== resourceUserId) {
    return res.status(403).json({
      message: "Vous ne pouvez modifier que vos propres données",
    })
  }

  next()
}

module.exports = {
  authenticateToken,
  optionalAuth,
  checkOwnership,
}