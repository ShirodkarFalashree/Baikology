
const User = require('../models/User');

// Save or update pregnancy profile
exports.savePregnancyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.pregnancyProfile = {
  ...(user.pregnancyProfile?.toObject?.() || user.pregnancyProfile || {}),
  ...req.body,
  wellnessLogs: user.pregnancyProfile?.wellnessLogs || [],
  isCompleted: true,
  updatedAt: new Date(),
};

user.markModified('pregnancyProfile');

    user.markModified('pregnancyProfile');
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Pregnancy profile saved successfully.',
      data: user.pregnancyProfile,
    });
  } catch (error) {
    console.error('Save pregnancy profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to save pregnancy profile.',
    });
  }
};

// Get pregnancy profile
exports.getPregnancyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('pregnancyProfile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user.pregnancyProfile,
    });
  } catch (error) {
    console.error('Get pregnancy profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve pregnancy profile.',
    });
  }
};

// Save daily pregnancy wellness check-in
exports.saveWellnessLog = async (req, res) => {
  try {
    const { sleepHours, energyLevel } = req.body;

    if (
      sleepHours === undefined ||
      !Number.isFinite(Number(sleepHours)) ||
      Number(sleepHours) < 0 ||
      Number(sleepHours) > 24
    ) {
      return res.status(400).json({
        success: false,
        message: 'Sleep hours must be between 0 and 24.',
      });
    }

    if (
      !Number.isInteger(Number(energyLevel)) ||
      Number(energyLevel) < 1 ||
      Number(energyLevel) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Energy level must be between 1 and 5.',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.pregnancyProfile?.isCompleted) {
      return res.status(404).json({
        success: false,
        message: 'Complete your pregnancy profile first.',
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const wellnessLogs = user.pregnancyProfile.wellnessLogs || [];

    const existingIndex = wellnessLogs.findIndex(
      (log) => log.date === today
    );

    const newLog = {
      date: today,
      sleepHours: Number(sleepHours),
      energyLevel: Number(energyLevel),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      wellnessLogs[existingIndex] = newLog;
    } else {
      wellnessLogs.push(newLog);
    }

    user.pregnancyProfile.wellnessLogs = wellnessLogs;
    user.markModified('pregnancyProfile');

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Wellness check-in saved successfully.',
      data: newLog,
    });
  } catch (error) {
    console.error('Save pregnancy wellness error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to save wellness check-in.',
    });
  }
};

// Get pregnancy wellness history
exports.getWellnessLogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('pregnancyProfile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const logs = user.pregnancyProfile?.wellnessLogs || [];

    return res.status(200).json({
      success: true,
      data: logs.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    });
  } catch (error) {
    console.error('Get pregnancy wellness history error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve wellness history.',
    });
  }
};
