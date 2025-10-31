import React from "react";
import { Link } from "react-router-dom";
import { Fuel, LogIn, UserPlus, MapPin, DollarSign, Star } from 'lucide-react';

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#4CAF50] p-4 rounded-full">
            <Fuel className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#333333] mb-2">
          Welcome to FuelWise
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find the most cost-effective gas station based on distance or fuel volume
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3 text-gray-700">
          <MapPin className="h-5 w-5 text-[#4CAF50]" />
          <span>Find nearby gas stations</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700">
          <DollarSign className="h-5 w-5 text-[#4CAF50]" />
          <span>Compare fuel prices</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700">
          <Star className="h-5 w-5 text-[#4CAF50]" />
          <span>Save money on every fill-up</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Link
          to="/search"
          className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <Fuel className="h-5 w-5" />
          <span>Continue as Guest</span>
        </Link>
        
        <Link
          to="/login"
          className="w-full bg-white hover:bg-gray-50 text-[#4CAF50] border-2 border-[#4CAF50] py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <LogIn className="h-5 w-5" />
          <span>Sign In</span>
        </Link>
        
        <Link
          to="/signup"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <UserPlus className="h-5 w-5" />
          <span>Create Account</span>
        </Link>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Join thousands of users saving money on fuel every day
        </p>
      </div>
    </div>
  </div>
);

export default LandingPage;
