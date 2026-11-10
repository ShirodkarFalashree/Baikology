
const User = require("../models/User");
const MoodLog = require("../models/MoodLog");
const { analyzeMood } = require("../services/aiService");

exports.getMoodInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    let moodLogs = await MoodLog.find({ user: userId }).sort({ date: 1 });

    if (!moodLogs || moodLogs.length === 0) {
      const user = await User.findById(userId).select("moodLogs");
      moodLogs = user?.moodLogs || [];
    }

    const insights = await analyzeMood(moodLogs || []);

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
