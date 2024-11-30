import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";

const TOTPSecret = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { otpSecret, url } = location.state || {};

  const handleReturnToLogin = () => {
    navigate("/");
  };

  return (
    <TOTPContainer>
      <TOTPForm>
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
        <ReturnButton onClick={handleReturnToLogin}>
          Return to Login
        </ReturnButton>
      </TOTPForm>
    </TOTPContainer>
  );
};

const TOTPContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const TOTPForm = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Secret = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Instructions = styled.p`
  font-size: 16px;
`;

const QRCodeContainer = styled.div`
  margin: 20px auto;
`;

const QRCodeInstructions = styled.p`
  font-size: 16px;
  text-align: center;
`;

const ReturnButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;

export default TOTPSecret;
