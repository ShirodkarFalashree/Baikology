/**
 * Baikology — Dear Diary AI Companion
 *
 * Re-routed to Groq AI inference engine.
 * Maintained for backward compatibility.
 */

const { generateGroqReply } = require("./groqService");

module.exports = {
  generateGeminiReply: generateGroqReply,
  generateGroqReply,
};
