import React, { useState, useContext } from "react";
import AuthContext from "./AuthContext";
import {
  GlobalStyle,
  Button,
  Container,
  TOTPForm as Form,
  Input,
  Title,
} from "./style";

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
    <>
      <GlobalStyle />
      <Container>
        <Form onSubmit={handleSubmit}>
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
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    </>
  );
};

export default MFA;
