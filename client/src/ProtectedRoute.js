import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedRoute = ({ children, path, redirectTo }) => {
  let condition = false

  if (path === "/dashboard") {
    condition = localStorage.getItem("isAuthenticated") === "true"
  } else if (path === "/mfa") {
    condition = localStorage.getItem("isMFARequired") === "true"
  }

  if (!condition) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
