import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import Submission from "./pages/Submission";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import { useAuth } from "./context/AuthContext";


/**
 * App — root routing component (Campus One integration).
 *
 * All routes are public — user identity is established via the
 * ?userId= URL parameter, handled by AuthContext.
 *
 * Routes:
 *   /               → redirect to /home
 *   /home           → Dashboard
 *   /problems       → Problem list
 *   /problems/:id   → Problem detail + code editor
 *   /submission/:id → Submission detail view
 *   /profile        → User profile
 *   *               → redirect to /home
 */
function App() {
  const { loading } = useAuth();

  // Wait for AuthContext to resolve the user before rendering routes
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-accent text-xs font-black animate-pulse tracking-widest">
          INITIALIZING_SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* All routes — no auth guard */}
          <Route path="/home" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route path="/submission/:submissionId" element={<Submission />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
