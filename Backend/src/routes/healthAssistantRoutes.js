const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const healthController = require('../controllers/healthAssistantController');

// Chat with health assistant (supports auth token for persistence)
router.post('/chat', authMiddleware, healthController.chatWithHealthAssistant);
router.get('/messages', authMiddleware, healthController.getHealthMessages);
router.delete('/messages', authMiddleware, healthController.clearHealthMessages);
router.post('/tuned-topics', authMiddleware, healthController.updateTunedTopics);

module.exports = router;

