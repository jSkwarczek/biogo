import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import bg from "./assets/images/bg.jpg";
import "@fontsource/roboto-slab";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
    color: white;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #433b7c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0.92;
`;

const DefNotForm = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #433b7c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const PageTitle = styled.text`
  font-size: 60px;
  text-align: center;
  align-self: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transition: background 0.3s ease, border 0.3s ease;
  &::placeholder {
    color: white;
  }
  &:focus {
    outline: none;
    border: 1px solid #fff;
    background: transparent;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #fff;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Roboto Slab", sans-serif;
  transition: background 0.3s ease, border 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const SmallButton = styled.button`
  width: 30px;
  height: 30px;
  position: relative;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Roboto Slab", sans-serif;
  transition: background 0.3s ease, border 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
  margin-bottom: 10px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  display: inline-block;
  place-content: center;
  margin-right: 10px;
  height: 20px;
  width: 20px;
`;

const Secret = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Instructions = styled.p`
  font-size: 16px;
`;

const QRCodeContainer = styled.div`
  padding: 25px;
  margin: 20px auto;
  background-color: #fff;
`;

const QRCodeInstructions = styled.p`
  font-size: 16px;
  text-align: center;
`;

export {
  GlobalStyle,
  Container,
  Form,
  Title,
  Input,
  Button,
  StyledLink,
  ErrorMessage,
  CheckboxContainer,
  CheckboxLabel,
  Checkbox,
  PageTitle,
  Secret,
  Instructions,
  QRCodeContainer,
  QRCodeInstructions,
  SmallButton,
  DefNotForm,
};
