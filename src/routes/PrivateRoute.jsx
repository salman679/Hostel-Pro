import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/auth/login" state={{ from: location }} replace />;
}

// Correct PropTypes definition
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
