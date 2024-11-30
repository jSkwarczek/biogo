import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import API from "./API";
import bg from "./assets/images/bg.jpg";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    color: white;
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [enableEmail2FA, setEnableEmail2FA] = useState(false);
  const [enableTOTP, setEnableTOTP] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    API.register(username, password, email, enableEmail2FA, enableTOTP)
      .then((response) => {
        if (response.status === "success") {
          if (enableTOTP) {
            navigate("/register/TOTP", {
              state: { otpSecret: response.otpSecret, url: response.url },
            });
          } else {
            navigate("/"); // Redirect to login page after successful registration
          }
        } else {
          setError(response.message || "Registration failed");
        }
      })
      .catch((error) => {
        setError("Error during registration");
        console.error("Error during registration:", error);
      });
  };

  return (
    <>
      <GlobalStyle />
      <RegisterContainer>
        <RegisterForm onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CheckboxContainer>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={enableEmail2FA}
                onChange={(e) => setEnableEmail2FA(e.target.checked)}
              />
              Email 2FA
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={enableTOTP}
                onChange={(e) => setEnableTOTP(e.target.checked)}
              />
              TOTP
            </CheckboxLabel>
          </CheckboxContainer>
          <SubmitButton type="submit">Zarejestruj się</SubmitButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </RegisterForm>
      </RegisterContainer>
    </>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const RegisterForm = styled.form`
  width: 15vw;
  display: flex;
  flex-direction: column;
  background-color: #433b7c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0.92;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  &::placeholder {
    color: white;
  }
  &:focus {
    outline: none;
    border: 1px solid #fff;
    background: transparent;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #ff7f7f;
  margin-bottom: 10px;
`;

export default Register;
