import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./API";
import {
  GlobalStyle,
  Container,
  RegisterForm,
  Input,
  CheckboxContainer,
  CheckboxLabel,
  Checkbox,
  SubmitButton,
  ErrorMessage,
} from "./style";

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
      <Container>
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
      </Container>
    </>
  );
};

export default Register;
