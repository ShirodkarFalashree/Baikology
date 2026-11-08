
const User = require("../models/User");
const { analyzeMood } = require("../services/aiService");

exports.getMoodInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("moodLogs");

    if (!user) {
      return res.status(404).json({
        success: false,
        detail: "User not found.",
      });
    }

    const insights = await analyzeMood(user.moodLogs || []);

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("AI mood insights error:", error.message);

    return res.status(503).json({
      success: false,
      detail: "Mood insights are temporarily unavailable.",
    });
  }
};
