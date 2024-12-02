import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedRoute = ({ children, condition, redirectTo }) => {
  const { isAuthenticated, isMFARequired } = useContext(AuthContext);

  if (!condition) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
