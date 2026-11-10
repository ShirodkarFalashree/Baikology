const User = require('../models/User');
const { generateHealthAssistantReply } = require('../services/healthAssistantService');

/**
 * Chat with Baikology Health & Wellness AI Assistant
 * POST /api/v1/health-assistant/chat
 */
exports.chatWithHealthAssistant = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = userId ? await User.findById(userId) : null;

    const { text, userContext } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        detail: 'Message text is required.',
      });
    }

    const userName = user?.name || user?.questionnaire?.preferredName || 'friend';
    const existingMessages = user?.healthChatMessages || [];

    // 1. Generate health response & detect topics
    const { reply, detectedTopics, recommendedArticleIds } = await generateHealthAssistantReply({
      userMessage: text.trim(),
      userName,
      userContext: userContext || {},
      chatHistory: existingMessages,
    });

    // 2. Persist to MongoDB if user logged in
    let updatedTunedTopics = user?.tunedTopics || [];

    if (user) {
      if (!Array.isArray(user.healthChatMessages)) {
        user.healthChatMessages = [];
      }

      // Add user message
      const userMsg = {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: text.trim(),
        timestamp: new Date(),
      };
      user.healthChatMessages.push(userMsg);

      // Add AI response
      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        detectedTopics: detectedTopics || [],
        recommendedArticles: recommendedArticleIds || [],
        timestamp: new Date(),
      };
      user.healthChatMessages.push(aiMsg);

      // Merge newly detected topics into tunedTopics
      if (Array.isArray(detectedTopics) && detectedTopics.length > 0) {
        const mergedSet = new Set([...(user.tunedTopics || []), ...detectedTopics]);
        updatedTunedTopics = Array.from(mergedSet);
      }

      // Atomically persist health messages & tuned topics without VersionError
      await User.findByIdAndUpdate(userId, {
        $push: {
          healthChatMessages: {
            $each: [userMsg, aiMsg],
            $slice: -60,
          },
        },
        $set: {
          tunedTopics: updatedTunedTopics,
        },
      });

      const updatedUser = await User.findById(userId).select('healthChatMessages');

      return res.status(200).json({
        success: true,
        reply,
        detectedTopics,
        recommendedArticles: recommendedArticleIds,
        tunedTopics: updatedTunedTopics,
        healthChatMessages: updatedUser?.healthChatMessages || [],
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      detectedTopics,
      recommendedArticles: recommendedArticleIds,
      tunedTopics: updatedTunedTopics,
      healthChatMessages: [],
    });
  } catch (error) {
    console.error('Health assistant chat error:', error);
    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to process health assistant question.',
    });
  }
};

/**
 * Get Health Assistant messages & tuned topics
 * GET /api/v1/health-assistant/messages
 */
exports.getHealthMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('healthChatMessages tunedTopics');

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      healthChatMessages: user.healthChatMessages || [],
      tunedTopics: user.tunedTopics || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to fetch health messages.',
    });
  }
};

/**
 * Clear Health Assistant chat history
 * DELETE /api/v1/health-assistant/messages
 */
exports.clearHealthMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    user.healthChatMessages = [];
    user.markModified('healthChatMessages');
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Health assistant history cleared.',
      healthChatMessages: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to clear health messages.',
    });
  }
};

/**
 * Update tuned topics directly
 * POST /api/v1/health-assistant/tuned-topics
 */
exports.updateTunedTopics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        detail: 'User not found.',
      });
    }

    const { topics } = req.body;
    if (Array.isArray(topics)) {
      user.tunedTopics = topics;
      user.markModified('tunedTopics');
      await user.save();
    }

    return res.status(200).json({
      success: true,
      tunedTopics: user.tunedTopics || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      detail: error.message || 'Failed to update tuned topics.',
    });
  }
};

