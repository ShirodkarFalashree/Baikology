const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD' formatted date string
      required: true,
    },
    label: {
      type: String,
      required: true,
      enum: ['Happy', 'Calm', 'Meh', 'Overwhelmed', 'Low'],
    },
    emoji: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#DDF3DE',
    },
    textColor: {
      type: String,
      default: '#2C6336',
    },
    note: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: Exactly one mood check-in per user per calendar day
moodLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);

