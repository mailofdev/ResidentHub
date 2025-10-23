// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticatedViaSession } from "../../services/firebase/authService";

export default function ProtectedRoute({ children }) {
  // Check both old and new authentication systems for backward compatibility
  const { user: oldUser, token } = useSelector((state) => state.auth);
  const { user: societyUser, isAuthenticated } = useSelector((state) => state.societyAuth);
  const storedToken = sessionStorage.getItem("auth_data");
  const societyCareSession = isAuthenticatedViaSession();

  // Check if user is authenticated in any system
  const isAuth = (token && oldUser) || (isAuthenticated && societyUser) || storedToken || societyCareSession;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
