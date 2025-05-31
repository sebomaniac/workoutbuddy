import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or you could return <div>Loading...</div> if you want some feedback
  }

  if (!isAuthenticated) {
    console.log("Unauthorized route. Please log in.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
