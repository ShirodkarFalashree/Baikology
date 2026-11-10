
const User = require('../models/User');
const {
  generatePregnancyAssistantReply,
} = require('../services/pregnancyAssistantService');

/**
 * POST /api/v1/pregnancy-assistant/chat
 */
exports.chatWithPregnancyAssistant = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        detail: 'Authentication required.',
      });
    }

    const text = req.body?.text?.trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        detail: 'Message text is required.',
      });
    }

    if (text.length > 3000) {
      return res.status(400).json({
        success: false,
        detail: 'Message cannot exceed 3000 characters.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    const userName =
      user.name ||
      user.full_name ||
      user.questionnaire?.preferredName ||
      'friend';

    const pregnancyProfile = user.pregnancyProfile || {};
    const existingMessages = user.pregnancyChatMessages || [];

    const reply = await generatePregnancyAssistantReply({
      userMessage: text,
      userName,
      pregnancyProfile,
      chatHistory: existingMessages,
    });

    const timestamp = new Date();

    const userMsg = {
      id: `pregnancy-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
    };

    const aiMsg = {
      id: `pregnancy-ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: new Date(),
    };

    await User.findByIdAndUpdate(userId, {
      $push: {
        pregnancyChatMessages: {
          $each: [userMsg, aiMsg],
          $slice: -60,
        },
      },
    });

    const updatedUser = await User.findById(userId)
      .select('pregnancyChatMessages');

    return res.status(200).json({
      success: true,
      reply,
      pregnancyChatMessages:
        updatedUser?.pregnancyChatMessages || [],
    });
  } catch (error) {
    console.error('Pregnancy AI chat error:', error);

    return res.status(500).json({
      success: false,
      detail:
        error.message || 'Failed to process pregnancy question.',
    });
  }
};

/**
 * GET /api/v1/pregnancy-assistant/messages
 */
exports.getPregnancyMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('pregnancyChatMessages');

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      pregnancyChatMessages: user.pregnancyChatMessages || [],
    });
  } catch (error) {
    console.error('Pregnancy AI history error:', error);

    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to fetch pregnancy chat history.',
    });
  }
};

/**
 * DELETE /api/v1/pregnancy-assistant/messages
 */
exports.clearPregnancyMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    user.pregnancyChatMessages = [];
    user.markModified('pregnancyChatMessages');

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Pregnancy AI chat history cleared.',
      pregnancyChatMessages: [],
    });
  } catch (error) {
    console.error('Pregnancy AI clear history error:', error);

    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to clear pregnancy chat history.',
    });
  }
};
