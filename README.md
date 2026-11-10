# 🌸 Baikology

### Your Companion for Women's Health, Wellness & Self-Care

Baikology is an AI-powered women's health platform designed to make health education, wellness tracking, and personalized guidance more accessible.

The platform brings together menstrual health, pregnancy care, mood insights, and AI-powered assistance in one place. Its goal is to provide a supportive, non-judgmental space where women can understand their health and make more informed decisions.

---

## ✨ Key Features

### 🩸 Period Care
- Menstrual cycle tracking and related health information.
- Period-related wellness guidance.
- Period care questionnaire and personalized information.

### 🤰 Pregnancy Care
- Pregnancy onboarding using relevant pregnancy information.
- Pregnancy dashboard and progress-related guidance.
- Pregnancy wellness resources.
- Pregnancy guide with educational content.
- Dedicated AI Pregnancy Assistant with separate conversation history.

### 🧠 AI-Powered Mood Insights
- Mood check-ins and reflection analysis.
- Sentiment and emotion analysis of written reflections.
- Mood distribution and historical insights.
- Supportive wellness insights based on available check-in data.

### 💬 AI Health Assistant
- Conversational health education and guidance.
- Dedicated pregnancy-aware AI conversations.
- Context-aware responses with appropriate medical safety limitations.

### 🔐 User Accounts
- User registration and authentication.
- Email OTP verification.
- Secure password storage.
- Personalized user profiles.

---

## 🤖 AI Capabilities

Baikology integrates AI to make health information more accessible and meaningful.

| AI Capability | Purpose |
|---|---|
| Sentiment Analysis | Understand emotional tone in written reflections |
| Emotion Detection | Identify emotions expressed through text |
| Topic Extraction | Identify recurring themes in reflections |
| LLM-based Assistance | Provide conversational health education |
| Pregnancy-aware Prompting | Tailor AI responses to pregnancy-related questions |

AI-generated insights are intended for educational and wellness support. They are not a substitute for professional medical advice, diagnosis, or treatment.

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST APIs

### AI / Machine Learning
- Python
- Flask
- Natural Language Processing
- Sentiment and Emotion Analysis
- Large Language Models (LLMs)
- Groq API

---

## 🏗️ Project Structure

```text
Baikology/
│
├── Backend/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── app.js
│
├── Frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── App.jsx
│
├── ai-service/
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- MongoDB connection
- Required API credentials for enabled AI services

### 1. Clone the Repository

```bash
git clone https://github.com/ShirodkarFalashree/Baikology.git
cd Baikology
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Configure the required environment variables in your backend `.env` file before starting the server.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

### 4. AI Service Setup

The AI service has its own Python dependencies and environment configuration.

Navigate to the `ai-service` directory, install its dependencies using its requirements file, configure the required environment variables, and start the Flask application using its configured entry point.

---

## 🔒 Environment Variables

Keep API keys, database credentials, JWT secrets, and other sensitive configuration in environment files.

Never commit `.env` files or expose private API credentials in the repository.

Refer to the backend and AI service configuration for the exact required variable names.

---

## 🩺 Important Disclaimer

Baikology is designed for health education, wellness tracking, and supportive guidance.

It does not provide medical diagnoses or replace qualified healthcare professionals. Users should consult healthcare professionals for medical concerns, and seek urgent medical attention when necessary.

---

## 🚀 Vision

Baikology aims to build a more accessible and supportive women's health ecosystem through technology, education, and responsible AI.

**Understand your health. Track your journey. Take care of yourself.**

---

*Built with care for women's health and well-being.*