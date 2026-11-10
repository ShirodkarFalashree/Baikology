const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your first or preferred name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default in queries
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false,
    },
    questionnaire: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    moodLogs: {
      type: [
        {
          date: { type: String, required: true }, // 'YYYY-MM-DD'
          label: { type: String, required: true },
          emoji: { type: String, required: true },
          color: { type: String },
          textColor: { type: String },
          note: { type: String, default: '' },
          loggedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    diaryMessages: {
      type: [
        {
          id: { type: String },
          sender: { type: String, enum: ['ai', 'user'], required: true },
          text: { type: String, required: true },
          moodContext: { type: String },
          moodShift: { type: String },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    healthChatMessages: {
      type: [
        {
          id: { type: String },
          sender: { type: String, enum: ['ai', 'user'], required: true },
          text: { type: String, required: true },
          detectedTopics: [{ type: String }],
          recommendedArticles: [{ type: String }],
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    tunedTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate crypto token for password reset
userSchema.methods.createPasswordResetToken = function () {
  // Generate unhashed random token to send via email
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token to store in database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration (1 hour from now)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
