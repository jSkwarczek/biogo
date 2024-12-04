import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user");
  });
  const [isMFARequired, setIsMFARequired] = useState(() => {
    return localStorage.getItem("isMFARequired") === "true";
  });
  const [isEmail2FAEnabled, setIsEmail2FAEnabled] = useState(false);
  const [isTOTPEnabled, setIsTOTPEnabled] = useState(false);
  const navigate = useNavigate();

  const login = (username, password) => {
    return API.login(username, password).then((response) => {
      if (response.status === "success") {
        localStorage.setItem("isMFARequired", "true");
        setIsEmail2FAEnabled(response.isEmail2FAEnabled);
        setIsTOTPEnabled(response.isTOTPEnabled);
        if (
          response.isEmail2FAEnabled === false &&
          response.isTOTPEnabled === false
        ) {
          localStorage.setItem("isMFARequired", "false");
          setUser(response.username);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", response.username);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          navigate("/mfa");
        }
      }
      return response;
    });
  };

  const verifyMFA = (code, totp) => {
    return API.verifyMFA(code, totp, isEmail2FAEnabled, isTOTPEnabled).then(
      (response) => {
        if (response.status === "success") {
          setIsAuthenticated(true);
          setIsMFARequired(false);
          setUser(response.username);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", response.username);
          navigate("/dashboard");
        }
        return response;
      }
    );
  };

  const logout = () => {
    return API.logout().then((response) => {
      if (response.status === "success") {
        setIsAuthenticated(false);
        setUser(null);
        setIsMFARequired(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        navigate("/");
      }
      return response;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        verifyMFA,
        logout,
        isMFARequired,
        isEmail2FAEnabled,
        isTOTPEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
