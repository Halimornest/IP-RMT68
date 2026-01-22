import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, isAuth, isLoading } = useSelector((s) => s.auth);

  if (token && !isAuth) {
    return <div className="text-center mt-5">Checking session...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
