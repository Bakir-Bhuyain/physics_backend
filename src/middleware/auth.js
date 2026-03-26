const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes — verifies JWT token
 * Attaches `req.user` to the request object
 */
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized. Please log in.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Token invalid.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalid or expired. Please log in again.',
    });
  }
};

module.exports = { protect };
