import React, { useState, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { GlobalStyle, Button, Container, Form, Input, Title } from "./style";

const MFA = () => {
  const [code, setCode] = useState("");
  const [totp, setTotp] = useState("");
  const { verifyMFA, isEmail2FAEnabled, isTOTPEnabled } =
    useContext(AuthContext);

  const handleSubmit = (e) => {
    console.log("wtf");
    e.preventDefault();
    verifyMFA(code, totp)
      .then((response) => {
        if (response.status !== "success") {
          console.error("MFA verification failed");
        }
      })
      .catch((error) => {
        console.error("Error during MFA verification:", error);
      });
  };

  useEffect(() => {
    document.title = "Biogo - MFA";
  }, []);

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
          <Button>Submit</Button>
        </Form>
      </Container>
    </>
  );
};

export default MFA;
