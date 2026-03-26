const express = require('express');
const { getTopics, getTopic, getChapters } = require('../controllers/topicController');

const router = express.Router();

// Public routes — topics are accessible without auth
router.get('/', getTopics);
router.get('/chapters', getChapters);
router.get('/:id', getTopic);

module.exports = router;
