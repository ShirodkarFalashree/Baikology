
const AI_SERVICE_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";

exports.analyzeMood = async (moodLogs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (process.env.AI_SERVICE_SECRET) {
      headers["X-AI-Service-Key"] = process.env.AI_SERVICE_SECRET;
    }

    const response = await fetch(`${AI_SERVICE_URL}/analyze/mood`, {
      method: "POST",
      headers,
      body: JSON.stringify({ moodLogs }),
      signal: controller.signal,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Python AI analysis failed");
    }

    return result.insights;
  } finally {
    clearTimeout(timeout);
  }
};
