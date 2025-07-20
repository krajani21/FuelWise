import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="auth-container">
    <h1>Welcome to FuelWise 🚗⛽</h1>
    <p>Find the best gas station based on distance or volume!</p>
    <div className="auth-buttons">
      <Link to="/login" className="nav-button">Login</Link>
      <Link to="/signup" className="nav-button">Sign Up</Link>
    </div>
  </div>
);

export default LandingPage;
