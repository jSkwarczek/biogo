import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MFA from "./MFA";
import Register from "./Register";
import TOTPSecret from "./TOTPSecret";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/TOTP" element={<TOTPSecret />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              condition={localStorage.getItem("isAuthenticated") === "true"}
              redirectTo="/"
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mfa"
          element={
            <ProtectedRoute
              condition={localStorage.getItem("isMFARequired") === "true"}
              redirectTo="/"
            >
              <MFA />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
