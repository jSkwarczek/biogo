import React, { useState, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import {
  GlobalStyle,
  Container,
  Form,
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Stan dla zarządzania przyciskiem
  const { login } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      localStorage.removeItem("isMFARequired");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    login(username, password)
      .then((response) => {
        if (response.status !== "success") {
          setError(response.message || "Unknown error");
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        setError("Error during login: " + error.message);
        setIsSubmitting(false);
        console.error("Error during login:", error);
      });
  };

  useEffect(() => {
    document.title = "Biogo - Logowanie";
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <div>
          <Form onSubmit={handleSubmit} style={{ width: "20vw" }}>
            <Title>Witaj!</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              placeholder="Login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </Form>
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
