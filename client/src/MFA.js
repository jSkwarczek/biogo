import React, { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "./AuthContext";
import {
  GlobalStyle,
  Button,
  Container,
  Form,
  Input,
  Title,
  DefNotForm,
  ErrorMessage,
} from "./style";
import Webcam from "react-webcam";

const MFA = () => {
  const [code, setCode] = useState("");
  const [totp, setTotp] = useState("");
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [error, setError] = useState("");
  const { verifyMFA, isEmail2FAEnabled, isTOTPEnabled } =
    useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("MFA verification in progress...");
    verifyMFA(code, totp, photo)
      .then((response) => {
        if (response.status !== "success") {
          console.error("MFA verification failed");
          setError("MFA verification failed!");
        }
      })
      .catch((error) => {
        setError("Error during MFA verification: " + error.message);
        console.error("Error during MFA verification:", error);
      });
  };

  const handleTakePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  useEffect(() => {
    document.title = "Biogo - MFA";
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        {photoConfirmed && (
          <Form onSubmit={handleSubmit}>
            <Title>Submit MFA</Title>
            <img
              src={photo}
              alt="BiometryPhoto"
              style={{
                borderRadius: "15px",
                marginBottom: "10px",
                width: "300px",
                alignSelf: "center",
              }}
            />
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
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
        )}
        {!photoConfirmed && (
          <DefNotForm
            style={{
              opacity: "1",
            }}
          >
            {!photo && (
              <>
                <Title>W celu weryfikacji zrób zdjęcie swojej twarzy</Title>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{
                    borderRadius: "15px",
                    marginBottom: "10px",
                    height: "60vh",
                    alignSelf: "center",
                  }}
                />
                <Button onClick={handleTakePhoto}>Zrób zdjęcie</Button>
              </>
            )}
            {photo && (
              <>
                <Title>Wybrane zdjęcie</Title>
                <img
                  src={photo}
                  alt="BiometryPhoto"
                  style={{
                    borderRadius: "15px",
                    marginBottom: "10px",
                  }}
                />
                <Button onClick={() => setPhoto(null)}>
                  Zrób nowe zdjęcie
                </Button>
                <Button onClick={() => setPhotoConfirmed(true)}>
                  Potwierdź zdjęcie
                </Button>
              </>
            )}
          </DefNotForm>
        )}
      </Container>
    </>
  );
};

export default MFA;
