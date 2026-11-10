/**
 * Baikology — AI Service
 *
 * Connects to Python AI service (Render / Local) for sentiment and theme analysis.
 * Provides a seamless built-in fallback analysis so the user's dashboard is always
 * responsive and never fails with 503 errors.
 */

const THEMES = {
  academic_pressure: [
    "exam", "exams", "study", "studies", "assignment",
    "grades", "college", "school", "marks", "academic",
    "deadline", "semester", "test"
  ],
  workload_and_career: [
    "work", "office", "job", "career", "workload",
    "meeting", "project", "boss", "internship", "interview"
  ],
  sleep_and_rest: [
    "sleep", "insomnia", "tired", "exhausted",
    "rest", "fatigue", "awake", "sleepless"
  ],
  relationships: [
    "relationship", "partner", "boyfriend", "girlfriend",
    "friend", "friends", "family", "parents",
    "argument", "lonely", "conflict"
  ],
  social_pressure: [
    "judged", "society", "expectations", "comparison",
    "pressure", "social media", "people think", "peer pressure"
  ],
  period_related_discomfort: [
    "period", "menstruation", "menstrual", "cramps",
    "bloating", "pms", "bleeding", "cycle pain"
  ],
  body_image: [
    "body image", "weight", "appearance", "skin",
    "looks", "body confidence", "insecure about my body"
  ],
  general_wellbeing: [
    "happy", "peaceful", "relaxed", "grateful",
    "motivated", "confident", "positive", "calm"
  ]
};

const POSITIVE_WORDS = ["happy", "great", "good", "love", "amazing", "wonderful", "calm", "peaceful", "grateful", "excited", "relieved", "proud"];
const NEGATIVE_WORDS = ["sad", "bad", "angry", "crying", "depressed", "anxious", "overwhelmed", "exhausted", "tired", "stressed", "pain", "cramps", "hurt", "hate", "lonely"];

/**
 * Built-in local fallback analysis when Python service is unavailable or cold-starting.
 */
function localAnalyzeMood(moodLogs = []) {
  if (!Array.isArray(moodLogs)) moodLogs = [];

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const filteredLogs = moodLogs.filter((entry) => {
    if (!entry || !entry.date) return false;
    const entryDate = new Date(entry.date);
    return !isNaN(entryDate.getTime()) && entryDate >= sevenDaysAgo && entryDate <= today;
  });

  const moodCounts = {};
  const themeCounts = {};
  let totalSentiment = 0;
  let writtenReflectionsCount = 0;

  for (const entry of filteredLogs) {
    const label = (entry.label || "").trim();
    if (label) {
      moodCounts[label] = (moodCounts[label] || 0) + 1;
    }

    const note = (entry.note || "").toLowerCase().trim();
    if (note) {
      writtenReflectionsCount++;
      // Simple word polarity estimation
      let score = 0;
      POSITIVE_WORDS.forEach((w) => { if (note.includes(w)) score += 0.3; });
      NEGATIVE_WORDS.forEach((w) => { if (note.includes(w)) score -= 0.3; });
      score = Math.max(-1, Math.min(1, score));
      totalSentiment += score;

      // Theme detection
      for (const [theme, keywords] of Object.entries(THEMES)) {
        if (keywords.some((kw) => note.includes(kw))) {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        }
      }
    }
  }

  let mostFrequentMood = null;
  let maxCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentMood = mood;
    }
  }

  const averageSentiment = writtenReflectionsCount > 0
    ? Math.round((totalSentiment / writtenReflectionsCount) * 1000) / 1000
    : null;

  let sentimentSummary = "Not enough written reflections to analyze text sentiment.";
  if (averageSentiment !== null) {
    if (averageSentiment >= 0.25) {
      sentimentSummary = "Your recent written reflections lean positive.";
    } else if (averageSentiment <= -0.25) {
      sentimentSummary = "Your recent written reflections lean negative.";
    } else {
      sentimentSummary = "Your recent written reflections show a mixed or neutral tone.";
    }
  }

  const recurringThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([theme, count]) => ({ theme, mentions: count }));

  return {
    recordsAnalyzed: filteredLogs.length,
    moodDistribution: moodCounts,
    mostFrequentMood,
    writtenReflectionsAnalyzed: writtenReflectionsCount,
    averageTextSentiment: averageSentiment,
    sentimentSummary,
    themeAnalysis: {
      themesDetected: recurringThemes.length,
      recurringThemes,
    },
    message: "These insights reflect your check-ins and written reflections. They are not a medical assessment."
  };
}

const AI_SERVICE_URL = (process.env.PYTHON_AI_URL || "https://baikologyai.onrender.com").replace(/\/+$/, "");

exports.analyzeMood = async (moodLogs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15 sec timeout

  const secret = (process.env.AI_SERVICE_SECRET || "").trim().replace(/\.+$/, "");

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (secret) {
      headers["X-AI-Service-Key"] = secret;
    }

    const response = await fetch(`${AI_SERVICE_URL}/analyze/mood`, {
      method: "POST",
      headers,
      body: JSON.stringify({ moodLogs }),
      signal: controller.signal,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || `Python AI service responded with status ${response.status}`);
    }

    return result.insights;
  } catch (err) {
    console.warn(`[Baikology AI] Remote AI service note (${err.message}). Using built-in local insights engine.`);
    return localAnalyzeMood(moodLogs);
  } finally {
    clearTimeout(timeout);
  }
};
