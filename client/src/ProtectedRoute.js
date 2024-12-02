import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isMFARequired = localStorage.getItem("isMFARequired") === "true";

  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  if (!isMFARequired && window.location.pathname === "/mfa") {
    return <Navigate to="/" />;
  }

  if (isMFARequired && window.location.pathname !== "/dashboard") {
    return <Navigate to="/mfa" />;
  }

  return children;
};

export default ProtectedRoute;
