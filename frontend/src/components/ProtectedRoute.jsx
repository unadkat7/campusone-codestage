import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Wraps any page component that requires a valid JWT.
 */
function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
