const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const { method = "GET", body, headers = {}, auth = true } = options;
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
    ...(auth ? getAuthHeaders() : {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.response = response;
    error.data = data;
    throw error;
  }
  return data;
};

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}) =>
  request("/api/auth/register", {
    method: "POST",
    body: { name, email, password, confirmPassword },
    auth: false,
  });

export const loginUser = async ({ email, password }) =>
  request("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });

export const forgotPassword = async (email) =>
  request("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
  });

export const resetPassword = async ({ token, email, newPassword }) =>
  request("/api/auth/reset-password", {
    method: "POST",
    body: { token, email, newPassword },
    auth: false,
  });

export const verifyResetToken = async ({ token, email }) =>
  request("/api/auth/verify-reset-token", {
    method: "POST",
    body: { token, email },
    auth: false,
  });

export const getProfile = async () => request("/api/user/profile");
export const getUserAttempts = async () => request("/api/user/attempts");
export const submitFeedback = async ({ message, userName, userEmail }) =>
  request("/api/feedback", {
    method: "POST",
    body: { message, userName, userEmail },
    auth: false,
  });

export const getQuestions = async ({
  level,
  department,
  course,
  count,
} = {}) => {
  const params = new URLSearchParams();
  if (level) params.append("level", level);
  if (department) params.append("department", department);
  if (course) params.append("course", course);
  if (count) params.append("count", count);

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/quiz/all${query}`, { method: "GET", auth: false });
};

export const submitAttempt = async (attempt) =>
  request("/api/quiz/submit", {
    method: "POST",
    body: attempt,
  });

export const getAdminQuestions = async () =>
  request("/api/admin/questions", { method: "GET" });
export const createAdminQuestion = async (question) =>
  request("/api/admin/questions", {
    method: "POST",
    body: question,
  });
export const deleteAdminQuestion = async (id) =>
  request(`/api/admin/questions/${id}`, {
    method: "DELETE",
  });

export const getAdminUsers = async () =>
  request("/api/admin/users", { method: "GET" });
export const toggleAdminUser = async (id) =>
  request(`/api/admin/users/${id}/admin`, {
    method: "PATCH",
  });

export const getAdminFeedback = async () =>
  request("/api/feedback", { method: "GET" });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
