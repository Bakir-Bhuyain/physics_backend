const express = require('express');
const { updateProgress, getUserProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All progress routes require authentication
router.post('/update', protect, updateProgress);
router.get('/user', protect, getUserProgress);

module.exports = router;
