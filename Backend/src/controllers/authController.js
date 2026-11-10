const User = require('../models/User');
const MoodLog = require('../models/MoodLog');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');
const { generateGroqReply } = require('../services/groqService');

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
        diaryMessages: [],
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
        diaryMessages: user.diaryMessages || [],
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

    // Fetch mood logs from dedicated MoodLog model
    let moodLogs = await MoodLog.find({ user: user._id }).sort({ date: 1 });

    // Migrate any legacy moodLogs from User document if MoodLog is empty
    if ((!moodLogs || moodLogs.length === 0) && Array.isArray(user.moodLogs) && user.moodLogs.length > 0) {
      try {
        const seedOps = user.moodLogs.map((log) => ({
          updateOne: {
            filter: { user: user._id, date: log.date },
            update: {
              $set: {
                user: user._id,
                date: log.date,
                label: log.label,
                emoji: log.emoji || '😌',
                color: log.color || '#DDF3DE',
                textColor: log.textColor || '#2C6336',
                note: log.note || '',
                loggedAt: log.loggedAt || new Date(),
              },
            },
            upsert: true,
          },
        }));
        await MoodLog.bulkWrite(seedOps);
        moodLogs = await MoodLog.find({ user: user._id }).sort({ date: 1 });
      } catch (migrationErr) {
        console.warn('MoodLog migration note:', migrationErr.message);
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted || false,
        questionnaire: user.questionnaire || null,
        moodLogs: moodLogs || [],
        diaryMessages: user.diaryMessages || [],
        tunedTopics: user.tunedTopics || [],
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

    // Upsert into dedicated MoodLog model
    const moodDoc = await MoodLog.findOneAndUpdate(
      { user: userId, date },
      {
        user: userId,
        date,
        label,
        emoji: emoji || '😌',
        color: color || '#DDF3DE',
        textColor: textColor || '#2C6336',
        note: note || '',
        loggedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Fetch all current mood logs from MoodLog model
    const allMoodLogs = await MoodLog.find({ user: userId }).sort({ date: 1 });

    // Sync to User document atomically without version error
    await User.findByIdAndUpdate(userId, {
      $set: {
        moodLogs: allMoodLogs.map((m) => ({
          date: m.date,
          label: m.label,
          emoji: m.emoji,
          color: m.color,
          textColor: m.textColor,
          note: m.note,
          loggedAt: m.loggedAt,
        })),
      },
    }).catch((err) => console.warn('User moodLogs sync note:', err.message));

    res.status(200).json({
      success: true,
      message: 'Mood checked in successfully! Marked on your calendar 🌸',
      moodLog: moodDoc,
      moodLogs: allMoodLogs,
    });
  } catch (error) {
    console.error('Save mood log error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to save daily mood log.',
    });
  }
};

/**
 * Get all mood logs for authenticated user
 * GET /api/v1/auth/mood
 */
exports.getMoodLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const moodLogs = await MoodLog.find({ user: userId }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      moodLogs: moodLogs || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to fetch mood logs.',
    });
  }
};

/**
 * Get diary messages
 * GET /api/v1/auth/diary
 */
exports.getDiaryMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      diaryMessages: user.diaryMessages || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to fetch diary messages.',
    });
  }
};

/**
 * Save a diary message
 * POST /api/v1/auth/diary
 */
exports.saveDiaryMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    const { sender, text, moodContext, moodShift, id } = req.body;

    if (!text || !sender) {
      return res.status(400).json({
        success: false,
        detail: 'Message text and sender are required.',
      });
    }

    if (!Array.isArray(user.diaryMessages)) {
      user.diaryMessages = [];
    }

    const newMsg = {
      id: id || Date.now().toString() + Math.random().toString(36).substring(2, 7),
      sender,
      text,
      moodContext: moodContext || '',
      moodShift: moodShift || '',
      timestamp: new Date(),
    };

    // Atomically persist message without VersionError
    await User.findByIdAndUpdate(userId, {
      $push: {
        diaryMessages: {
          $each: [newMsg],
          $slice: -100,
        },
      },
    });

    const updatedUser = await User.findById(userId).select('diaryMessages');

    res.status(200).json({
      success: true,
      message: 'Diary message recorded.',
      diaryMessage: newMsg,
      diaryMessages: updatedUser?.diaryMessages || [],
    });
  } catch (error) {
    console.error('Save diary message error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to save diary message.',
    });
  }
};

/**
 * Clear diary messages
 * DELETE /api/v1/auth/diary
 */
exports.clearDiaryMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    user.diaryMessages = [];
    user.markModified('diaryMessages');
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Diary messages cleared.',
      diaryMessages: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to clear diary messages.',
    });
  }
};

/**
 * Chat with Groq AI Dear Diary Companion
 * POST /api/v1/auth/diary/chat
 */
exports.chatWithDiary = exports.chatWithGemini = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    const { text, currentMood, previousMood, cycleAnalysis } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Message text is required.',
      });
    }

    if (!Array.isArray(user.diaryMessages)) {
      user.diaryMessages = [];
    }

    const userName = user.name || user.questionnaire?.preferredName || 'lovely';

    // 1. Record User Message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      moodContext: currentMood?.label || '',
      timestamp: new Date(),
    };
    user.diaryMessages.push(userMsg);

    // 2. Generate Groq response
    const aiReplyText = await generateGroqReply({
      userMessage: text.trim(),
      userName,
      currentMood,
      previousMood,
      cycleAnalysis,
      questionnaire: user.questionnaire || {},
      chatHistory: user.diaryMessages,
    });

    // 3. Record AI Message
    const aiMsg = {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: aiReplyText,
      moodContext: currentMood?.label || '',
      timestamp: new Date(),
    };
    user.diaryMessages.push(aiMsg);

    // Atomically persist conversation without VersionError
    await User.findByIdAndUpdate(userId, {
      $push: {
        diaryMessages: {
          $each: [userMsg, aiMsg],
          $slice: -100,
        },
      },
    });

    const updatedUser = await User.findById(userId).select('diaryMessages');

    res.status(200).json({
      success: true,
      aiReply: aiReplyText,
      userMessage: userMsg,
      aiMessage: aiMsg,
      diaryMessages: updatedUser?.diaryMessages || [],
    });
  } catch (error) {
    console.error('Chat with Diary error:', error);
    res.status(500).json({
      success: false,
      detail: error.message || 'Failed to generate response.',
    });
  }
};
