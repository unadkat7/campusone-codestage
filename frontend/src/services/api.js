import axios from "axios";

// ─── Axios Instance ──────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
  /**
   * POST /auth/register
   * Body: { name, email, password, role? }
   * Returns: { message, token, user: { id, name, email, role } }
   */
  register: (data) => API.post("/auth/register", data),

  /**
   * POST /auth/login
   * Body: { email, password }
   * Returns: { message, token, user: { id, name, email, role } }
   */
  login: (data) => API.post("/auth/login", data),
};

// ─── Problems API ─────────────────────────────────────────────────────────────
export const problemsAPI = {
  /**
   * GET /problems  [Auth required]
   * Returns: [{ _id, title, difficulty }]
   */
  getAll: () => API.get("/problems"),

  /**
   * GET /problems/:id
   * Returns: { _id, title, difficulty, description, sampleInput, sampleOutput, testCases (visible only) }
   */
  getById: (id) => API.get(`/problems/${id}`),

  /**
   * GET /problems/:id/stats
   * Returns: { totalSubmissions, acceptedSubmissions, acceptanceRate }
   */
  getStats: (id) => API.get(`/problems/${id}/stats`),
};

// ─── Submissions API ──────────────────────────────────────────────────────────
export const submissionsAPI = {
  /**
   * POST /submissions  [Auth required]
   * Body: { problemId, code, language }
   * Returns: { message, submissionId, status: "Pending" }
   */
  create: (data) => API.post("/submissions", data),

  /**
   * GET /submissions/:submissionId  [Auth required]
   * Returns: { _id, problemId, language, status, executionTime, memoryUsed, failedTestCase, output, createdAt }
   */
  getById: (submissionId) => API.get(`/submissions/${submissionId}`),

  /**
   * GET /submissions/history/:problemId  [Auth required]
   * Returns: [{ _id, language, status, executionTime, memoryUsed, failedTestCase, createdAt }]
   */
  getHistory: (problemId) => API.get(`/submissions/history/${problemId}`),

  /**
   * POST /submissions/run  [Auth required]
   * Body: { problemId, code, language }
   * Returns: { status, output, executionTime, memoryUsed, failedTestCase? }
   */
  runCode: (data) => API.post("/submissions/run", data),
};

// ─── User Profile API ─────────────────────────────────────────────────────────
export const userAPI = {
  /**
   * GET /users/profile  [Auth required]
   * Returns: { user, stats, languages, heatmap, badges, recentActivity }
   */
  getProfile: () => API.get("/users/profile"),

  /**
   * PUT /users/profile  [Auth required]
   * Body: { bio?, location?, githubUrl?, linkedinUrl?, websiteUrl? }
   * Returns: { message, user }
   */
  updateProfile: (data) => API.put("/users/profile", data),

  /**
   * POST /users/upload-avatar  [Auth required]
   * Body: FormData { avatar: File }
   * Returns: { message, profilePicture, user }
   */
  uploadAvatar: (formData) =>
    API.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};