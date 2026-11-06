const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

// Helper to sign JWT tokens
function signToken(userId, email, rememberMe = false) {
  const secret = process.env.JWT_SECRET || 'baikology-secret-key-change-in-production';
  const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '7d');
  return jwt.sign({ id: userId, email }, secret, { expiresIn });
}

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Please provide your first or preferred name.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Please provide a valid email address.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        detail: 'Please enter a valid email format.',
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        detail: 'Password must be at least 8 characters long.',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        detail: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = signToken(newUser._id, newUser.email);

    res.status(201).json({
      success: true,
      message: 'Your account has been created successfully! Welcome to Baikology 🌸',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isOnboardingCompleted: newUser.isOnboardingCompleted || false,
        questionnaire: newUser.questionnaire || null,
        moodLogs: [],
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Something went wrong while creating your account.',
    });
  }
};

/**
 * Log in an existing user
 * POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password, remember_me, rememberMe } = req.body;
    const isRemember = remember_me || rememberMe || false;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Please enter your email address.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        detail: 'Please enter your password.',
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        detail: 'Invalid email or password. Please check your credentials and try again.',
      });
    }

    const token = signToken(user._id, user.email, isRemember);

    res.status(200).json({
      success: true,
      message: 'Welcome back 💗',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted || false,
        questionnaire: user.questionnaire || null,
        moodLogs: user.moodLogs || [],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Something went wrong during sign-in.',
    });
  }
};

/**
 * Request password recovery email
 * POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Please enter your account email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    let emailResult = null;

    if (user) {
      // Generate reset token and set expiry
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      // Send the email
      emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
    }

    // Return neutral success response so email existence isn't leaked to scrapers
    res.status(200).json({
      success: true,
      message:
        'If an account is associated with this email, we have sent a gentle reset link. Please check your inbox and spam folder.',
      previewUrl: emailResult?.previewUrl,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Unable to process password reset request at this time.',
    });
  }
};

/**
 * Reset password using token
 * POST /api/v1/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!token) {
      return res.status(400).json({
        success: false,
        detail: 'Reset token is missing or malformed.',
      });
    }

    if (!finalPassword || finalPassword.length < 8) {
      return res.status(400).json({
        success: false,
        detail: 'Your new password must be at least 8 characters long.',
      });
    }

    // Hash the token provided in the URL to compare with database hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        detail: 'The password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Update password and clear reset fields
    user.password = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = signToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You are now logged in 🤍',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Something went wrong while resetting your password.',
    });
  }
};

/**
 * Get currently authenticated user profile
 * GET /api/v1/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted || false,
        questionnaire: user.questionnaire || null,
        moodLogs: user.moodLogs || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message,
    });
  }
};

/**
 * Save user onboarding questionnaire
 * POST /api/v1/auth/questionnaire
 */
exports.saveQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    // Save all questionnaire answers along with timestamp
    user.questionnaire = {
      ...(user.questionnaire || {}),
      ...req.body,
      completedAt: new Date(),
    };

    user.isOnboardingCompleted = true;
    user.markModified('questionnaire');
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Questionnaire completed successfully! Welcome to your Baikology space 🌸',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted,
        questionnaire: user.questionnaire,
      },
    });
  } catch (error) {
    console.error('Save questionnaire error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to save questionnaire responses.',
    });
  }
};

/**
 * Log daily mood
 * POST /api/v1/auth/mood
 */
exports.saveMoodLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    const { date, label, emoji, color, textColor, note } = req.body;

    if (!date || !label) {
      return res.status(400).json({
        success: false,
        detail: 'Date and mood label are required.',
      });
    }

    if (!Array.isArray(user.moodLogs)) {
      user.moodLogs = [];
    }

    const existingIndex = user.moodLogs.findIndex((log) => log.date === date);

    const moodEntry = {
      date,
      label,
      emoji: emoji || '😌',
      color: color || '#DDF3DE',
      textColor: textColor || '#2C6336',
      note: note || '',
      loggedAt: new Date(),
    };

    if (existingIndex >= 0) {
      user.moodLogs[existingIndex] = moodEntry;
    } else {
      user.moodLogs.push(moodEntry);
    }

    user.markModified('moodLogs');
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mood checked in successfully! Marked on your calendar 🌸',
      moodLog: moodEntry,
      moodLogs: user.moodLogs,
    });
  } catch (error) {
    console.error('Save mood log error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to save daily mood log.',
    });
  }
};
