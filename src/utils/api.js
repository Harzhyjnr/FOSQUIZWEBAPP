// src/utils/api.js

const API_BASE = (process.env.REACT_APP_API_URL || "/api").replace(/\/$/, "");

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
  const { method = "GET", body, headers = {}, auth = true } = options;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
    ...(auth ? getAuthHeaders() : {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ==================== AUTH ====================
export const registerUser = (data) =>
  request("/auth/register", { method: "POST", body: data, auth: false });

export const loginUser = (data) =>
  request("/auth/login", { method: "POST", body: data, auth: false });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
  });

export const resetPassword = (data) =>
  request("/auth/reset-password", { method: "POST", body: data, auth: false });

// ==================== USER ====================
export const getProfile = () => request("/user/profile");
export const getUserAttempts = () => request("/user/attempts");

// ==================== QUIZ ====================
export const getQuestions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/quiz/all${query ? `?${query}` : ""}`, { auth: false });
};

export const submitAttempt = (attempt) =>
  request("/quiz/submit", { method: "POST", body: attempt });

// ==================== ADMIN ====================
export const getAdminQuestions = () => request("/admin/questions");
export const createAdminQuestion = (question) =>
  request("/admin/questions", { method: "POST", body: question });
export const deleteAdminQuestion = (id) =>
  request(`/admin/questions/${id}`, { method: "DELETE" });

export const getAdminUsers = () => request("/admin/users");
export const toggleAdminUser = (id) =>
  request(`/admin/users/${id}/admin`, { method: "PATCH" });

// Feedback
export const submitFeedback = (data) =>
  request("/feedback", { method: "POST", body: data, auth: false });

export const getAdminFeedback = () => request("/feedback");

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
