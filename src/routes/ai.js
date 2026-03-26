const express = require('express');
const { askAI, getUsage } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All AI routes require authentication
router.post('/ask', protect, askAI);
router.get('/usage', protect, getUsage);

module.exports = router;
