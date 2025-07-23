import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="login-wrapper">
    <div className="login-card landing-card">
      <h1 className="landing-title">Welcome to FuelWise 🚗⛽</h1>
      <p className="landing-subtitle">
        Find the most cost-effective gas station based on distance or fuel volume.
      </p>
      <div className="landing-buttons">
        <Link to="/login" className="login-button">Login</Link>
        <Link to="/signup" className="login-button">Sign Up</Link>
      </div>
    </div>
  </div>
);

export default LandingPage;
