
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected user route
router.get('/me', authMiddleware, authController.getMe);
router.post('/questionnaire', authMiddleware, authController.saveQuestionnaire);
router.post('/mood', authMiddleware, authController.saveMoodLog);

module.exports = router;