import React, { useContext } from "react";
import AuthContext from "./AuthContext";
import { Container, GlobalStyle, Button, PageTitle } from "./style";
import catSpinningGif from "./assets/images/cat-spinning.gif";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout().then((response) => {
      if (response.status === "success") {
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={catSpinningGif}
            alt="Spinning Cat"
            style={{ marginTop: "10px", width: "500px", height: "auto" }}
          />
          <PageTitle>Witaj!</PageTitle>
          <h1>Pomyślnie się zalogowałeś na własne (lub czyjeś) konto.</h1>
          <Button onClick={handleLogout} style={{ marginTop: "10px" }}>
            Wyloguj się
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
