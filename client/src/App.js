import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MFA from "./MFA";
import Register from "./Register";
import TOTPSecret from "./TOTPSecret";

const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
const isMFARequired = localStorage.getItem("isMFARequired") === "true";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/TOTP" element={<TOTPSecret />} />

        {isAuthenticated && <Route path="/dashboard" element={<Dashboard />} />}
        {isMFARequired && <Route path="/mfa" element={<MFA />} />}
      </Routes>
    </AuthProvider>
  );
}

export default App;
