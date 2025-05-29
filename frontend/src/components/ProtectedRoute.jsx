import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Unauthorized route. Please log in.");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
