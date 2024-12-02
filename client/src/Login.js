import React, { useState, useContext } from "react";
import AuthContext from "./AuthContext";
import {
  GlobalStyle,
  Container,
  LoginForm,
  Title,
  Input,
  Button,
  StyledLink,
  ErrorMessage,
} from "./style";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password)
      .then((response) => {
        if (response.status !== "success") {
          setError(response.message || "Unknown error");
        }
      })
      .catch((error) => {
        setError("Błąd podczas logowania: " + error.message);
        console.error("Error during login:", error);
      });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <div>
          <LoginForm onSubmit={handleSubmit}>
            <Title>Witaj!</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              placeholder="Login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Zaloguj się</Button>
          </LoginForm>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nie masz jeszcze konta?{" "}
            <StyledLink to="/register">Zarejestruj się tu</StyledLink>
          </p>
        </div>
      </Container>
    </>
  );
};

export default Login;
