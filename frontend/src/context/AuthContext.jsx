import { createContext, useState, useContext, useEffect, useCallback } from "react";
import API from "../services/api";

// Create context
export const AuthContext = createContext();

/**
 * AuthProvider — Campus One integration.
 *
 * Reads `userId` from the URL query string (?userId=xxx) on first load.
 * Persists it to localStorage so subsequent navigations within CodeStage
 * don't need the parameter again.
 * Fetches the full user object from the backend using x-user-id header.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch the basic user info from backend.
   * The x-user-id header is automatically attached by the API interceptor.
   */
  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1️⃣ Check URL for userId parameter
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get("userId");

    if (urlUserId) {
      // Save to localStorage and use it
      localStorage.setItem("userId", urlUserId);
    }

    // 2️⃣ Check if we have a userId at all (from URL or previous session)
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      fetchUser();
    } else {
      // No userId available — nothing to do
      setLoading(false);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Convenience hook — throws if used outside AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
