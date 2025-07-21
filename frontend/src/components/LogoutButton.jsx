import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // go back to landing page
  };

  return (
    <button
      onClick={handleLogout}
      className="nav-button"
      style={{ marginBottom: "20px", backgroundColor: "#dc3545" }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
