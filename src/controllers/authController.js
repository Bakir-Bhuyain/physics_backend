const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Generate JWT Token ─────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ── POST /api/auth/register ────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email is already registered.' });
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        languagePreference: user.languagePreference,
        dailyAiUsage: user.dailyAiUsage,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed. Try again.' });
  }
};

// ── POST /api/auth/login ───────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password.' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        languagePreference: user.languagePreference,
        dailyAiUsage: user.dailyAiUsage,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed. Try again.' });
  }
};

// ── GET /api/auth/me ───────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        languagePreference: user.languagePreference,
        dailyAiUsage: user.dailyAiUsage,
        lastUsageDate: user.lastUsageDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user.' });
  }
};

// ── PATCH /api/auth/language ───────────────────────────
const updateLanguage = async (req, res) => {
  try {
    const { languagePreference } = req.body;
    if (!['bangla', 'english'].includes(languagePreference)) {
      return res.status(400).json({ success: false, error: 'Invalid language preference.' });
    }

    await User.findByIdAndUpdate(req.user.id, { languagePreference });
    res.json({ success: true, languagePreference });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update language preference.' });
  }
};

module.exports = { register, login, getMe, updateLanguage };
