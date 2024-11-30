import React, { useContext } from "react";
import AuthContext from "./AuthContext";

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
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div
          style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}
        >
          <h2>Widget 1</h2>
          <p>Some content for widget 1.</p>
        </div>
        <div
          style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}
        >
          <h2>Widget 2</h2>
          <p>Some content for widget 2.</p>
        </div>
        <div
          style={{ border: "1px solid #ccc", padding: "10px", width: "30%" }}
        >
          <h2>Widget 3</h2>
          <p>Some content for widget 3.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
