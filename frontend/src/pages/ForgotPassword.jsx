import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Fuel, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        // In development, show the reset URL
        if (data.resetUrl) {
          console.log("Reset URL:", data.resetUrl);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Forgot Password form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Link
              to="/login"
              className="flex items-center text-[#4CAF50] hover:text-green-600 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-3xl font-bold text-[#333333]">Forgot Password</h2>
          </div>
          
          {!isSuccess ? (
            <>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  disabled={isLoading}
                  className="w-full bg-[#4CAF50] hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-[#4CAF50]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                    setMessage("");
                  }}
                  className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-200"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-[#4CAF50] hover:text-green-600 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
