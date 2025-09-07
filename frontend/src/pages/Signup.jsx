import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Fuel } from 'lucide-react';
import ProfileSetup from "./ProfileSetup";
import { API_BASE_URL } from '../config/api';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Store token in localStorage and state
        localStorage.setItem('token', data.token);
        setUserToken(data.token);
        // Show profile setup instead
        setShowProfileSetup(true);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const handleProfileComplete = () => {
    // Now login and navigate to home
    login(userToken);
    navigate("/");
  };

  // If profile setup is shown, render that instead
  if (showProfileSetup) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Fuel className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <h1 className="text-4xl font-bold text-[#003366] mb-2">FuelWise</h1>
          <p className="text-gray-600">Smart fuel savings for everyone</p>
        </div>

        {/* Signup form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-[#333333] text-center mb-8">Join FuelWise Today</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#333333] mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Username
              </label>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                id="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#4CAF50] hover:text-green-600 font-medium transition-colors duration-200"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
