import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate("/distance");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Create an Account</h2>

        <label htmlFor="username" className="login-label">Username</label>
        <input
          name="username"
          type="text"
          id="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          required
          className="login-input"
        />

        <label htmlFor="email" className="login-label">Email</label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          className="login-input"
        />

        <label htmlFor="password" className="login-label">Password</label>
        <input
          name="password"
          type="password"
          id="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">Sign Up</button>

        <div className="login-footer">
          <a href="/login" className="forgot-password">Already have an account?</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
