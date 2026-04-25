import axios from "axios";

// ─── Base URL Logic ──────────────────────────────────────────────────────────
// Automatically append /api if it's missing from the environment variable
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseURL && !baseURL.endsWith("/api") && !baseURL.endsWith("/api/")) {
  baseURL = baseURL.endsWith("/") ? `${baseURL}api` : `${baseURL}/api`;
}

console.log(`[API] Initializing with base URL: ${baseURL}`);

const API = axios.create({
  baseURL,
  timeout: 15000, // 15 second timeout
});

// Attach userId to every request via x-user-id header
API.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
};

// ─── Problems API ─────────────────────────────────────────────────────────────
export const problemsAPI = {
  getAll: () => API.get("/problems"),
  getById: (id) => API.get(`/problems/${id}`),
  getStats: (id) => API.get(`/problems/${id}/stats`),
};

// ─── Submissions API ──────────────────────────────────────────────────────────
export const submissionsAPI = {
  create: (data) => API.post("/submissions", data),
  getById: (submissionId) => API.get(`/submissions/${submissionId}`),
  getHistory: (problemId) => API.get(`/submissions/history/${problemId}`),
  runCode: (data) => API.post("/submissions/run", data),
};

// ─── User Profile API ─────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => API.get("/users/profile"),
  updateProfile: (data) => API.put("/users/profile", data),
  uploadAvatar: (formData) =>
    API.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};