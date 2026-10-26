/**
 * Baikology Authentication API Client
 *
 * Prepared for FastAPI backend integration at /api/v1/auth/*
 * Adheres strictly to privacy principles: never logs or stores credentials.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper to handle fetch requests with timeout and friendly connection error handling
 */
async function apiRequest(endpoint, bodyData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // 404 means the endpoint isn't mounted yet in the backend
      if (response.status === 404) {
        return {
          success: false,
          isBackendUnavailable: true,
          message:
            'The authentication service endpoint is currently being prepared on the backend. Your details have been validated locally.',
        };
      }

      return {
        success: false,
        message: data?.detail || `Server responded with status ${response.status}.`,
        errors: data?.errors,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    // Network error or aborted timeout (e.g., backend server not running yet)
    return {
      success: false,
      isBackendUnavailable: true,
      message:
        'The backend authentication service is currently being prepared. Your inputs passed all frontend validation rules, but live server authentication is not connected yet.',
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
