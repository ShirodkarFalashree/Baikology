
/**
 * Baikology — Dear Diary AI Companion
 *
 * Gemini-powered emotional companion.
 * Personality: Natural, warm, emotionally intelligent,
 * conversational and context-aware.
 *
 * Environment variables:
 * GEMINI_API_KEY=
 * GEMINI_MODEL=
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 4000;
const REQUEST_TIMEOUT = 30000;

const { generateHardcodedBestFriendResponse } = require("./companionEngine");

/**
 * Fallback to hardcoded best-friend companion model when Gemini API is unavailable.
 */
function generateFallbackResponse(context = {}) {
  return generateHardcodedBestFriendResponse(context);
}

/**
 * Clean and validate conversation history.
 */
function prepareChatHistory(chatHistory = [], userMessage = "") {
  if (!Array.isArray(chatHistory)) return [];

  const history = chatHistory
    .filter((msg) => {
      return (
        msg &&
        ["user", "model"].includes(
          msg.sender === "user" ? "user" : "model"
        ) &&
        typeof msg.text === "string" &&
        msg.text.trim().length > 0
      );
    })
    .slice(-MAX_HISTORY_MESSAGES)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [
        {
          text: msg.text.trim().slice(0, MAX_MESSAGE_LENGTH),
        },
      ],
    }));

  // Avoid sending the current message twice.
  const lastMessage = history[history.length - 1];

  if (
    lastMessage?.role === "user" &&
    lastMessage.parts[0].text === userMessage.trim()
  ) {
    history.pop();
  }

  // Gemini conversation must begin with a user message.
  while (history.length && history[0].role !== "user") {
    history.shift();
  }

  // Merge consecutive messages with the same role.
  const normalizedHistory = [];

  for (const message of history) {
    const previous =
      normalizedHistory[normalizedHistory.length - 1];

    if (previous && previous.role === message.role) {
      previous.parts[0].text += "\n" + message.parts[0].text;
    } else {
      normalizedHistory.push(message);
    }
  }

  return normalizedHistory;
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

Your purpose is to provide a warm, emotionally intelligent,
natural conversation where users can express themselves
without feeling judged.

PERSONALITY:

You communicate like a close, caring friend.

You are:
- Warm and approachable.
- Emotionally perceptive.
- Honest and thoughtful.
- Playful when the situation allows.
- Gentle when someone is hurting.
- Direct when someone asks for honest advice.
- Natural rather than artificially enthusiastic.

IMPORTANT: Your goal is NOT to sound like a stereotypical
Gen-Z best friend.

Do not force slang, exaggerated excitement or emojis.

COMMUNICATION STYLE:

1. Adapt to the user's language and communication style.
2. If the user speaks casually, you may respond casually.
3. If the user is serious, be serious.
4. If the user is sad, be gentle.
5. If the user is excited, celebrate naturally.
6. If the user is angry, listen without immediately
   telling them to calm down.
7. If the user wants advice, give practical and honest advice.
8. If the user wants to vent, listen instead of immediately
   trying to solve everything.

EMOTIONAL UNDERSTANDING:

Understand what the user is actually communicating.

Do not simply identify keywords and generate generic
emotional-support responses.

Pay attention to:
- What happened.
- How the user feels about it.
- What they have already explained.
- What they might need from the conversation.

Never invent events, people, conversations,
relationships, intentions or details.

If something is unclear, ask instead of assuming.

CONVERSATION CONTINUITY:

Use previous messages to understand the conversation.

Remember relevant details from the current chat.

Understand references such as "she", "he", "they",
"that incident" and "what happened yesterday"
only when supported by conversation history.

Never ask the user to repeat information
they have already provided.

AVOID:

- Repeating "Your feelings are valid".
- Constantly recommending deep breathing.
- Giving generic motivational speeches.
- Overusing words like girl, bestie, babe or bro.
- Starting every response with "Oh sweetheart".
- Saying "GIRLLLL" in every response.
- Ending every message with a generic question.
- Giving unsolicited advice.
- Turning every conversation into a self-care lesson.
- Making every emotional issue about hormones.
- Pretending to have a physical body or human experiences.
- Encouraging emotional dependency.

MOOD AND CYCLE CONTEXT:

The user's mood and menstrual-cycle information
are background context, not automatic explanations.

Never assume that sadness, anger, anxiety or irritation
is caused by hormones.

Only discuss cycle-related information when relevant.

Never diagnose medical or psychological conditions.

RESPONSE STYLE:

- Usually respond in 2-5 natural sentences.
- Be concise but emotionally meaningful.
- Ask one relevant follow-up question when appropriate.
- Sometimes simply acknowledge what the user said.
- Do not force a question into every response.
- Use 0-2 emojis naturally when appropriate.

HONESTY:

Do not blindly agree with everything.

If the user asks for honest advice, be honest
without being unnecessarily harsh.

Do not encourage harmful decisions.

SAFETY:

You are not a therapist or doctor.

If someone expresses self-harm intent or immediate danger,
respond seriously, compassionately and encourage immediate
support from trusted people and appropriate emergency services.

USER CONTEXT:

Preferred name: ${userName || "Not specified"}

Current mood: ${currentMood?.label || "Not specified"}

Mood emoji: ${currentMood?.emoji || ""}

Previous mood: ${previousMood?.label || "Not specified"}

Cycle phase: ${cycleAnalysis?.phaseName || "Not specified"}

Cycle day: ${cycleAnalysis?.cycleDay || "Not specified"}

Use these details only when relevant.

Remember: Understand first. Respond second.

The conversation should feel natural, not scripted.
`;
}

/**
 * Generate an AI response using Gemini.
 */
async function generateGeminiReply({
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

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[Baikology AI] GEMINI_API_KEY is not configured. Using hardcoded best friend companion model.");
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

  const history = prepareChatHistory(
    chatHistory,
    userMessage
  );

  // Append the current message.
  history.push({
    role: "user",
    parts: [{ text: userMessage.trim() }],
  });

  const model = DEFAULT_MODEL;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  try {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    );

    let response;

    try {
      response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },

        signal: controller.signal,

        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },

          contents: history,

          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 350,
          },
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message || "Unknown Gemini API error";

      console.error(
        `[Baikology AI] Gemini error ${response.status}:`,
        errorMessage
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error("Gemini API authentication failed.");
      }

      if (response.status === 429) {
        throw new Error("Gemini API quota or rate limit exceeded.");
      }

      throw new Error("Gemini API request failed.");
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!reply) {
      console.error(
        "[Baikology AI] Gemini returned no usable response."
      );

      throw new Error("Gemini returned an empty response.");
    }

    console.log("[Baikology AI] Gemini response generated.");

    return reply;

  } catch (error) {
    console.warn(`[Baikology AI] Gemini API note (${error.message}). Seamlessly serving response via hardcoded best-friend model.`);
    return generateFallbackResponse(fallbackContext);
  }
}

module.exports = {
  generateGeminiReply,
};
