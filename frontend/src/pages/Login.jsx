import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/distance";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate(from, { replace: true }); // redirect back to original route if they were trying to access a protected route before being told to login
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
