import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  Container,
  GlobalStyle,
  Button,
  Title,
  Form,
  Secret,
  Instructions,
  QRCodeContainer,
  QRCodeInstructions,
} from "./style";

const TOTPSecret = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { otpSecret, url } = location.state || {};

  const handleReturnToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    document.title = "Biogo - TOTP";
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Form>
          <Title>Your TOTP Secret</Title>
          <Secret>{otpSecret}</Secret>
          <Instructions>
            Please save this secret in your TOTP application (e.g., Google
            Authenticator).
          </Instructions>
          {url && (
            <>
              <QRCodeContainer>
                <QRCodeCanvas value={url} size={200} />
              </QRCodeContainer>
              <QRCodeInstructions>
                Scan the QR code above with your TOTP application.
              </QRCodeInstructions>
            </>
          )}
          <Button onClick={handleReturnToLogin}>Return to Login</Button>
        </Form>
      </Container>
    </>
  );
};

export default TOTPSecret;
