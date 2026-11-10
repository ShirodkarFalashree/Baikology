/**
 * Baikology — Dear Diary AI Companion (Groq Powered)
 *
 * Powered by Groq's high-speed inference engine.
 * Personality: Warm, emotionally intelligent, funny, caring female best friend.
 * Natural, spontaneous, non-judgmental, and emotionally connected.
 *
 * Environment variables:
 * GROQ_API_KEY=
 * GROQ_MODEL=
 */

const { generateHardcodedBestFriendResponse } = require("./companionEngine");

const DEFAULT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const FALLBACK_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];

const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 4000;
const REQUEST_TIMEOUT = 25000;

/**
 * Fallback to hardcoded best-friend companion model when Groq API is unavailable.
 */
function generateFallbackResponse(context = {}) {
  return generateHardcodedBestFriendResponse(context);
}

/**
 * Clean and validate conversation history for Groq (OpenAI chat format).
 */
function prepareChatMessages({
  systemInstruction,
  chatHistory = [],
  userMessage = "",
}) {
  const messages = [{ role: "system", content: systemInstruction }];

  if (Array.isArray(chatHistory)) {
    const validHistory = chatHistory
      .filter((msg) => {
        return (
          msg &&
          (msg.sender === "user" || msg.sender === "ai" || msg.sender === "model" || msg.role === "assistant" || msg.role === "user") &&
          typeof (msg.text || msg.content) === "string" &&
          (msg.text || msg.content).trim().length > 0
        );
      })
      .slice(-MAX_HISTORY_MESSAGES)
      .map((msg) => {
        const isUser = msg.sender === "user" || msg.role === "user";
        const content = (msg.text || msg.content || "").trim().slice(0, MAX_MESSAGE_LENGTH);
        return {
          role: isUser ? "user" : "assistant",
          content,
        };
      });

    // Avoid duplicating the current message if it was already recorded in history
    const lastMsg = validHistory[validHistory.length - 1];
    if (lastMsg?.role === "user" && lastMsg.content === userMessage.trim()) {
      validHistory.pop();
    }

    messages.push(...validHistory);
  }

  // Append current user message
  messages.push({
    role: "user",
    content: userMessage.trim().slice(0, MAX_MESSAGE_LENGTH),
  });

  return messages;
}

/**
 * Build Baikology's personality and user context.
 */
function buildSystemInstruction({
  userName,
  currentMood,
  previousMood,
  cycleAnalysis,
}) {
  return `
You are Baikology's Dear Diary companion.

Your purpose is to be a close, emotionally intelligent, funny, caring female best friend who listens without judging.

1. PERSONALITY:
- Warm, affectionate, and emotionally perceptive.
- Playful and expressive; funny when the situation allows.
- Gentle and present when the user is hurting or vulnerable.
- Occasionally dramatic in a cute, friendly way (e.g., "GIRLLLL WHAT HAPPENED 😭", "WAIT TELL ME EVERYTHING", "EXCUSE ME??? THAT'S ACTUALLY AMAZING!").
- Communicates like a genuine best friend, NEVER like a customer support agent, therapist, or doctor.

2. EMOTIONAL UNDERSTANDING:
- Understand the emotion BEHIND the words.
- If the user says: "Everyone keeps expecting things from me", do NOT say "Your feelings are valid. Practice self-care."
  Instead, understand the pressure: "Ugh, that sounds like so much pressure. Does it feel like nobody is stopping to ask what YOU actually need?"
- If the user feels like they're falling behind: understand the insecurity, ask what triggered it, and respond to the real situation.
- If the user shares a win or exciting news: celebrate enthusiastically!
- If the user is crying or sad: be gentle, sit with them, and do not force fake positivity.
- If the user is angry: let them vent; do not immediately tell them to calm down.
- If the user asks for honest advice: give practical, honest perspective without being cruel.

3. CONVERSATION CONTINUITY:
- Remember details and people mentioned earlier in the conversation (friends, bosses, roommates, partners, dates).
- If the user previously mentioned a fight with a friend and now says "She didn't even apologize", understand who "she" refers to!

4. STRICTLY AVOID:
- NEVER say "Your feelings are valid."
- NEVER tell them to "take deep breaths" or "practice mindfulness".
- NEVER give generic motivational speeches or self-care checklists.
- NEVER end every message with "How can I help you?"
- NEVER sound clinical, robotic, or like a therapist.
- Do not overuse emojis (0 to 2 per response is natural).

5. USER CONTEXT:
- Preferred name: ${userName || "lovely"}
- Current mood: ${currentMood?.label ? `${currentMood.label} ${currentMood?.emoji || ""}` : "Not logged yet"}
- Previous mood: ${previousMood?.label ? `${previousMood.label} ${previousMood?.emoji || ""}` : "None"}
- Cycle phase: ${cycleAnalysis?.phaseName || "Not specified"} (Day ${cycleAnalysis?.cycleDay || "?"})
Note: Never force menstrual or hormonal explanations unless the user mentions symptoms or it is directly relevant.

6. LENGTH:
- Default to 2 to 4 natural, conversational sentences.
`.trim();
}

/**
 * Generate an AI response using Groq.
 */
async function generateGroqReply({
  userMessage,
  userName = "lovely",
  currentMood = null,
  previousMood = null,
  cycleAnalysis = {},
  questionnaire = {},
  chatHistory = [],
}) {
  const fallbackContext = {
    userMessage,
    userName,
    currentMood,
    previousMood,
    cycleAnalysis,
    chatHistory,
  };

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[Baikology AI] GROQ_API_KEY is missing. Using local best friend companion model.");
    return generateFallbackResponse(fallbackContext);
  }

  if (
    typeof userMessage !== "string" ||
    !userMessage.trim() ||
    userMessage.length > MAX_MESSAGE_LENGTH
  ) {
    throw new Error("Invalid diary message.");
  }

  const systemInstruction = buildSystemInstruction({
    userName,
    currentMood,
    previousMood,
    cycleAnalysis,
  });

  const messages = prepareChatMessages({
    systemInstruction,
    chatHistory,
    userMessage,
  });

  const preferredModel = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      let response;
      try {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.85,
            max_tokens: 400,
          }),
        });
      } finally {
        clearTimeout(timeout);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `Groq status ${response.status}`;
        console.warn(`[Baikology AI] Groq model ${model} error (${response.status}): ${errorMsg}`);
        lastError = new Error(errorMsg);
        continue; // Try next fallback model
      }

      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) {
        console.log(`[Baikology AI] Groq response generated via ${model}`);
        return reply;
      }
    } catch (err) {
      console.warn(`[Baikology AI] Groq attempt with ${model} failed: ${err.message}`);
      lastError = err;
    }
  }

  console.warn(
    `[Baikology AI] All Groq model attempts exhausted (${lastError?.message || "unknown"}). Falling back to local companion engine.`
  );
  return generateFallbackResponse(fallbackContext);
}

module.exports = {
  generateGroqReply,
  // Alias for backward compatibility with existing imports
  generateGeminiReply: generateGroqReply,
};

