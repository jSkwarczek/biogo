import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  console.log(
    "isAuthenticated",
    localStorage.getItem("isAuthenticated") === "true"
  );
  console.log("isMFARequired", localStorage.getItem("isMFARequired"));
  if (localStorage.getItem("isAuthenticated") !== "true") {
    return <Navigate to="/" />;
  }

  if (
    localStorage.getItem("isMFARequired") === "true" &&
    window.location.pathname !== "/dashboard"
  ) {
    return <Navigate to="/mfa" />;
  }

  return children;
};

export default ProtectedRoute;
