
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const pregnancyAssistantController = require('../controllers/pregnancyAssistantController');

// Pregnancy AI Guide
router.post(
  '/chat',
  authMiddleware,
  pregnancyAssistantController.chatWithPregnancyAssistant
);

router.get(
  '/messages',
  authMiddleware,
  pregnancyAssistantController.getPregnancyMessages
);

router.delete(
  '/messages',
  authMiddleware,
  pregnancyAssistantController.clearPregnancyMessages
);

module.exports = router;
