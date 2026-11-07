/**
 * Baikology Authentication API Client
 *
 * Connected to Node.js / Express backend at http://localhost:5000/api/v1/auth/*
 * Adheres strictly to privacy principles: never logs or exposes credentials.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper to handle fetch requests with timeout and friendly connection error handling
 */
async function apiRequest(endpoint, bodyData, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const method = options.method || (bodyData ? 'POST' : 'GET');
  const token = options.token || localStorage.getItem('baikology_token');

  const headers = {
    'Accept': 'application/json',
  };

  if (bodyData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: bodyData ? JSON.stringify(bodyData) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          isBackendUnavailable: true,
          message:
            'The API endpoint is currently not reachable. Please ensure the backend is running.',
        };
      }

      return {
        success: false,
        message: data?.detail || data?.message || `Server responded with status ${response.status}.`,
        errors: data?.errors,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    return {
      success: false,
      isBackendUnavailable: true,
      message:
        'Could not connect to the authentication server at ' +
        API_BASE_URL +
        '. Please make sure the backend server is running.',
    };
  }
}

/**
 * Sign in existing user
 */
export async function loginUser({ email, password, rememberMe = false }) {
  return await apiRequest('/api/v1/auth/login', {
    email,
    password,
    remember_me: rememberMe,
  });
}

/**
 * Register a new user
 */
export async function registerUser({ name, email, password }) {
  return await apiRequest('/api/v1/auth/register', {
    name,
    email,
    password,
  });
}

/**
 * Request password recovery link
 */
export async function forgotPassword({ email }) {
  return await apiRequest('/api/v1/auth/forgot-password', {
    email,
  });
}

/**
 * Reset password using token from email link
 */
export async function resetPassword({ token, newPassword }) {
  return await apiRequest('/api/v1/auth/reset-password', {
    token,
    newPassword,
  });
}

/**
 * Get authenticated user profile (verifies session against backend DB)
 */
export async function getCurrentUser(token) {
  return await apiRequest('/api/v1/auth/me', null, { method: 'GET', token });
}

/**
 * Save onboarding questionnaire responses to user profile in backend DB
 */
export async function saveQuestionnaire(questionnaireData, token) {
  return await apiRequest('/api/v1/auth/questionnaire', questionnaireData, {
    method: 'POST',
    token,
  });
}

/**
 * Log daily mood check-in to user profile in backend DB
 */
export async function logMoodCheckIn(moodData, token) {
  return await apiRequest('/api/v1/auth/mood', moodData, {
    method: 'POST',
    token,
  });
}

/**
 * Fetch Dear Diary chat messages from user profile
 */
export async function getDiaryMessages(token) {
  return await apiRequest('/api/v1/auth/diary', null, {
    method: 'GET',
    token,
  });
}

/**
 * Save a Dear Diary chat message to user profile in backend DB
 */
export async function saveDiaryMessage(messageData, token) {
  return await apiRequest('/api/v1/auth/diary', messageData, {
    method: 'POST',
    token,
  });
}

/**
 * Clear Dear Diary chat history from user profile
 */
export async function clearDiaryMessages(token) {
  return await apiRequest('/api/v1/auth/diary', null, {
    method: 'DELETE',
    token,
  });
}

/**
 * Send chat message to Gemini AI Dear Diary Companion
 */
export async function sendDiaryChatMessage({ text, currentMood, previousMood, cycleAnalysis }, token) {
  return await apiRequest(
    '/api/v1/auth/diary/chat',
    { text, currentMood, previousMood, cycleAnalysis },
    {
      method: 'POST',
      token,
    }
  );
}
