import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import AuthContext from "./AuthContext";
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
      <LoginContainer>
        <div>
          <LoginForm onSubmit={handleSubmit}>
            <Title>Witaj!</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="text"
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
            <LoginButton type="submit">Zaloguj się</LoginButton>
          </LoginForm>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nie masz jeszcze konta?{" "}
            <StyledLink to="/register">Zarejestruj się tu</StyledLink>
          </p>
        </div>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const LoginForm = styled.form`
  width: 20vw;
  display: flex;
  flex-direction: column;
  background-color: #433b7c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0.92;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
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

const LoginButton = styled.button`
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

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #ff7f7f;
  margin-bottom: 10px;
  text-align: center;
`;

export default Login;
