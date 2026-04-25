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
 * :userId URL path parameter, handled by AuthContext.
 *
 * URL pattern: /<page>/<userId>/...
 * Example: /home/69eb29ace5b1f9408b8e60fb
 *
 * Routes:
 *   /                                → redirect to /home (userId picked from localStorage)
 *   /home/:userId                    → Dashboard
 *   /problems/:userId                → Problem list
 *   /problems/:userId/:id            → Problem detail + code editor
 *   /submission/:userId/:submissionId → Submission detail view
 *   /profile/:userId                 → User profile
 *   *                                → redirect to /home
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
          {/* Default redirect — try to preserve userId from localStorage */}
          <Route path="/" element={<DefaultRedirect />} />

          {/* All routes — userId is a path parameter */}
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/problems/:userId" element={<Problems />} />
          <Route path="/problems/:userId/:id" element={<ProblemDetails />} />
          <Route path="/submission/:userId/:submissionId" element={<Submission />} />
          <Route path="/profile/:userId" element={<Profile />} />

          {/* Catch-all */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
    </BrowserRouter>
  );
}

/**
 * DefaultRedirect — redirects to /home/:userId using stored userId,
 * or shows an error if no userId is available.
 */
function DefaultRedirect() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return <Navigate to={`/home/${userId}`} replace />;
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="text-error text-xs font-black tracking-widest">
        ERROR: NO_USER_ID_DETECTED // ACCESS_DENIED
      </div>
    </div>
  );
}

export default App;
