import { useParams } from "react-router-dom";

/**
 * useUserId — Returns the userId from the URL path param,
 * falling back to localStorage if not in the route.
 */
export function useUserId() {
  const params = useParams();
  return params.userId || localStorage.getItem("userId") || "";
}
