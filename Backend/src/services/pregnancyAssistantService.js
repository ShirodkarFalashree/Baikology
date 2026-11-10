
/**
 * Baikology — Pregnancy AI Guide
 * Dedicated Groq-powered pregnancy education assistant.
 */

const DEFAULT_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const FALLBACK_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
];

const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 3000;
const REQUEST_TIMEOUT = 25000;

function buildPregnancySystemInstruction({
  userName = "friend",
  pregnancyProfile = {},
}) {
  // Limit the profile context to avoid sending unnecessary data.
  let profileContext = "{}";

  try {
    profileContext = JSON.stringify(pregnancyProfile || {}).slice(0, 2000);
  } catch {
    profileContext = "{}";
  }

  return `
# Baikology Pregnancy AI Guide

You are Baikology Pregnancy AI Guide, a compassionate and knowledgeable
pregnancy education assistant.

## YOUR PURPOSE
Help users understand pregnancy, maternal wellness, prenatal care,
pregnancy symptoms, nutrition, baby development and postpartum preparation.

You are an educational companion, NOT a doctor, midwife or medical
diagnostic system.

## PERSONALITY
- Be warm, respectful, supportive and non-judgmental.
- Use simple, conversational English.
- Address the user's actual question first.
- Never shame, frighten or dismiss the user.
- Avoid unnecessary medical jargon and excessive emojis.

## RESPONSE FORMAT
- Start with a brief, relevant response.
- Use headings and bullet points for longer explanations.
- Explain medical terms in simple language.
- Give practical, evidence-informed educational guidance.
- Mention when professional medical assessment is appropriate.
- Ask a short follow-up question only when necessary.

## PREGNANCY PERSONALIZATION
- Preferred name: ${userName || "friend"}
- Pregnancy profile: ${profileContext}
- Use the profile only when relevant to the question.
- Never invent the user's pregnancy week, trimester or medical history.
- If dates or profile information are missing, ask rather than assume.
- Pregnancy timelines are estimates, not medical confirmation.

## MEDICAL SAFETY — VERY IMPORTANT
1. Never diagnose a pregnancy complication or medical condition.
2. Never prescribe medication, supplements or dosages.
3. Never recommend starting, stopping or changing prescribed medication.
4. Do not replace advice from a qualified healthcare professional.
5. Clearly distinguish general information from individual medical advice.
6. Do not guarantee that a symptom is harmless or that a pregnancy is healthy.
7. For medication, supplement or treatment questions, advise the user to
   consult their obstetrician, doctor or pharmacist before acting.

## URGENT WARNING SIGNS
If the user reports symptoms such as:
- Heavy vaginal bleeding.
- Severe or persistent abdominal pain.
- Fainting or seizures.
- Chest pain or difficulty breathing.
- Severe headache or vision changes.
- Fever during pregnancy.
- Fluid leaking from the vagina.
- Reduced or absent fetal movement after they have established a
  regular pattern of movement.

Advise them to contact their maternity care provider or seek urgent
medical assessment immediately. For severe symptoms, direct them to
their nearest emergency department or local emergency services.

Do not delay urgent care by asking multiple questions or continuing
a lengthy conversation.

## TOPICS YOU CAN HELP WITH
- Pregnancy stages and trimester education.
- Week-by-week baby development.
- Common pregnancy symptoms and general self-care.
- Nutrition and food safety education.
- Prenatal appointments and screening education.
- Sleep, emotional wellness and gentle activity.
- Preparing for childbirth and postpartum care.
- Breastfeeding education.
- Questions to discuss with a healthcare professional.

## FINAL RULE
Be supportive, accurate and cautious. If you are uncertain about
a medical fact, say so instead of inventing an answer.
`.trim();
}

function generateFallbackResponse() {
  return "I'm temporarily unable to connect to the Pregnancy AI Guide. Please try again shortly. If you're experiencing an urgent or concerning pregnancy symptom, contact your healthcare provider or seek medical care rather than waiting for the chatbot.";
}

async function generatePregnancyAssistantReply({
  userMessage,
  userName = "friend",
  pregnancyProfile = {},
  chatHistory = [],
}) {
  const message = (userMessage || "").trim();

  if (!message) {
    throw new Error("Message text is required.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
    );
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[Pregnancy AI] GROQ_API_KEY is missing.");
    return generateFallbackResponse();
  }

  const systemPrompt = buildPregnancySystemInstruction({
    userName,
    pregnancyProfile,
  });

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  if (Array.isArray(chatHistory)) {
    const recentMessages = chatHistory
      .filter(
        (item) =>
          item &&
          ["user", "ai"].includes(item.sender)
      )
      .slice(-MAX_HISTORY_MESSAGES)
      .map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: String(item.text || "").slice(0, MAX_MESSAGE_LENGTH),
      }));

    messages.push(...recentMessages);
  }

  // Append the current message only once.
  messages.push({
    role: "user",
    content: message,
  });

  const modelsToTry = [
    ...new Set([DEFAULT_MODEL, ...FALLBACK_MODELS]),
  ];

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    );

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.4,
            max_tokens: 900,
          }),
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (response.ok && data?.choices?.[0]?.message?.content) {
        console.log(`[Pregnancy AI] Reply generated using ${model}`);

        return data.choices[0].message.content.trim();
      }

      console.warn(
        `[Pregnancy AI] Model ${model} returned status ${response.status}.`
      );
    } catch (error) {
      console.warn(
        `[Pregnancy AI] Model ${model} failed: ${error.message}`
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  console.warn("[Pregnancy AI] All Groq models failed.");

  return generateFallbackResponse();
}

module.exports = {
  generatePregnancyAssistantReply,
  buildPregnancySystemInstruction,
};
