import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./API";
import {
  GlobalStyle,
  Container,
  Form,
  Input,
  CheckboxContainer,
  CheckboxLabel,
  Checkbox,
  Button,
  ErrorMessage,
  SmallButton,
} from "./style";

function evalPasswordStrength(password) {
  if (!password) return "";

  if (password.length < 8) return "Weak";
  else if (password.length < 14) return "Medium";
  else return "Strong";
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [multipleEmails, setMultipleEmails] = useState(false);
  const [enableEmail2FA, setEnableEmail2FA] = useState(false);
  const [enableTOTP, setEnableTOTP] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length > 25) {
      setError("You can upload up to 25 photos.");
      return;
    }
    const readers = validFiles.map((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prevPhotos) => [...prevPhotos, reader.result]);
      };
      reader.readAsDataURL(file);
      return reader;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    if (photos.length < 3) {
      setError("Please upload at least three photos.");
      return;
    }
    API.register(
      username,
      password,
      email,
      email2,
      enableEmail2FA,
      enableTOTP,
      photos
    )
      .then((response) => {
        if (response.status === "success") {
          if (enableTOTP) {
            navigate("/register/TOTP", {
              state: { otpSecret: response.otpSecret, url: response.url },
            });
          } else {
            navigate("/");
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

  useEffect(() => {
    document.title = "Biogo - Rejestracja";
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Form onSubmit={handleSubmit} style={{ width: "15vw" }}>
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
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(evalPasswordStrength(e.target.value));
            }}
          />
          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <CheckboxLabel>
            Password strength:
            <span
              style={{
                color:
                  passwordStrength === "Strong"
                    ? "lightgreen"
                    : passwordStrength === "Medium"
                    ? "orange"
                    : "red",
                marginLeft: "5px",
              }}
            >
              {passwordStrength}
            </span>
          </CheckboxLabel>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <SmallButton
              type="button"
              onClick={() => setMultipleEmails(true)}
              disabled={multipleEmails}
              style={{ backgroundColor: multipleEmails ? "gray" : "" }}
            >
              +
            </SmallButton>
          </div>
          {multipleEmails && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="email"
                placeholder="Dodatkowy email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                style={{ flex: 1 }}
              />
              <SmallButton
                type="button"
                onClick={() => {
                  setMultipleEmails(false);
                  setEmail2("");
                }}
              >
                -
              </SmallButton>
            </div>
          )}
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
          <div>
            <CheckboxLabel>Biometrics Photo</CheckboxLabel>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
          </div>
          <Button type="submit" style={{ marginTop: "10px" }}>
            Zarejestruj się
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </Container>
    </>
  );
};

export default Register;
