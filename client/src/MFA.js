import React, { useState, useContext } from "react";
import styled from "styled-components";
import AuthContext from "./AuthContext";

const MFA = () => {
  const [code, setCode] = useState("");
  const [totp, setTotp] = useState("");
  const { verifyMFA, isEmail2FAEnabled, isTOTPEnabled } =
    useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyMFA(code, totp)
      .then((response) => {
        if (response.status !== "success") {
          // Handle MFA verification failure
          console.error("MFA verification failed");
        }
      })
      .catch((error) => {
        console.error("Error during MFA verification:", error);
      });
  };

  return (
    <MFAContainer>
      <MFAForm onSubmit={handleSubmit}>
        <Title>Enter MFA Codes</Title>
        {isEmail2FAEnabled && (
          <Input
            type="text"
            placeholder="Email Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        )}
        {isTOTPEnabled && (
          <Input
            type="text"
            placeholder="TOTP Code"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
          />
        )}
        <SubmitButton type="submit">Submit</SubmitButton>
      </MFAForm>
    </MFAContainer>
  );
};

const MFAContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const MFAForm = styled.form`
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

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

export default MFA;
