
import os
from collections import Counter
from datetime import date, timedelta
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

load_dotenv()

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

AI_SERVICE_SECRET = os.getenv("AI_SERVICE_SECRET")

THEMES = {
    "academic_pressure": [
        "exam", "exams", "study", "studies", "assignment",
        "grades", "college", "school", "marks", "academic",
        "deadline", "semester", "test"
    ],
    "workload_and_career": [
        "work", "office", "job", "career", "workload",
        "meeting", "project", "boss", "internship", "interview"
    ],
    "sleep_and_rest": [
        "sleep", "insomnia", "tired", "exhausted",
        "rest", "fatigue", "awake", "sleepless"
    ],
    "relationships": [
        "relationship", "partner", "boyfriend", "girlfriend",
        "friend", "friends", "family", "parents",
        "argument", "lonely", "conflict"
    ],
    "social_pressure": [
        "judged", "society", "expectations", "comparison",
        "pressure", "social media", "people think", "peer pressure"
    ],
    "period_related_discomfort": [
        "period", "menstruation", "menstrual", "cramps",
        "bloating", "pms", "bleeding", "cycle pain"
    ],
    "body_image": [
        "body image", "weight", "appearance", "skin",
        "looks", "body confidence", "insecure about my body"
    ],
    "general_wellbeing": [
        "happy", "peaceful", "relaxed", "grateful",
        "motivated", "confident", "positive", "calm"
    ]
}


def require_service_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if AI_SERVICE_SECRET:
            supplied = request.headers.get("X-AI-Service-Key")

            if supplied != AI_SERVICE_SECRET:
                return jsonify({
                    "success": False,
                    "message": "Unauthorized"
                }), 401

        return func(*args, **kwargs)

    return wrapper


def detect_themes(text):
    text = text.lower()
    detected = []

    for theme, keywords in THEMES.items():
        if any(keyword in text for keyword in keywords):
            detected.append(theme)

    return detected


@app.get("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "Baikology AI"
    })


@app.post("/analyze/mood")
@require_service_key
def analyze_mood():
    payload = request.get_json(silent=True) or {}
    mood_logs = payload.get("moodLogs", [])

    if not isinstance(mood_logs, list):
        return jsonify({
            "success": False,
            "message": "moodLogs must be a list"
        }), 400

    # Last 7 calendar days, including today
    today = date.today()
    start_date = today - timedelta(days=6)

    filtered_logs = []

    for entry in mood_logs:
        if not isinstance(entry, dict):
            continue

        try:
            entry_date = date.fromisoformat(entry.get("date", ""))

            if start_date <= entry_date <= today:
                filtered_logs.append(entry)

        except (ValueError, TypeError):
            continue

    mood_counts = Counter()
    sentiment_scores = []
    theme_counts = Counter()
    analyzed_records = 0

    for entry in filtered_logs:
        analyzed_records += 1

        label = str(entry.get("label", "")).strip()

        if label:
            mood_counts[label] += 1

        note = entry.get("note", "")

        if isinstance(note, str) and note.strip():
            sentiment = analyzer.polarity_scores(note)["compound"]
            sentiment_scores.append(sentiment)

            for theme in detect_themes(note):
                theme_counts[theme] += 1

    average_sentiment = (
        round(sum(sentiment_scores) / len(sentiment_scores), 3)
        if sentiment_scores else None
    )

    if average_sentiment is None:
        sentiment_summary = (
            "Not enough written reflections to analyze text sentiment."
        )
    elif average_sentiment >= 0.25:
        sentiment_summary = "Your recent written reflections lean positive."
    elif average_sentiment <= -0.25:
        sentiment_summary = "Your recent written reflections lean negative."
    else:
        sentiment_summary = (
            "Your recent written reflections show a mixed or neutral tone."
        )

    recurring_themes = [
        {"theme": theme, "mentions": count}
        for theme, count in theme_counts.most_common()
    ]

    insights = {
        "recordsAnalyzed": analyzed_records,
        "moodDistribution": dict(mood_counts),
        "mostFrequentMood": (
            mood_counts.most_common(1)[0][0] if mood_counts else None
        ),
        "writtenReflectionsAnalyzed": len(sentiment_scores),
        "averageTextSentiment": average_sentiment,
        "sentimentSummary": sentiment_summary,
        "themeAnalysis": {
            "themesDetected": len(theme_counts),
            "recurringThemes": recurring_themes
        },
        "message": (
            "These insights reflect your check-ins and written "
            "reflections. They are not a medical assessment."
        )
    }

    return jsonify({
        "success": True,
        "insights": insights
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000))
    )
