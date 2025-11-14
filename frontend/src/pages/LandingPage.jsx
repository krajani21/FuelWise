import React from "react";
import { Link } from "react-router-dom";
import { Fuel, LogIn, UserPlus, MapPin, DollarSign, Star, Navigation, Car, TrendingDown, Shield, Clock, Search, ArrowRight } from 'lucide-react';

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-[#003366] to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-[#4CAF50] p-6 rounded-full shadow-2xl">
            <Fuel className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Welcome to FuelWise
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Smart fuel savings for everyone. Find the cheapest gas stations and optimize your fuel costs.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/search"
            className="bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Fuel className="h-5 w-5" />
            <span>Continue as Guest</span>
          </Link>
          
          <Link
            to="/signup"
            className="bg-white hover:bg-gray-100 text-[#003366] py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </Link>
        </div>

        <p className="text-sm opacity-75">
          Join thousands of users saving money on fuel every day
        </p>
      </div>
    </div>

    {/* About Section */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#333333] mb-4">About FuelWise</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          FuelWise is your trusted companion for finding the most affordable fuel prices in your area. 
          We help drivers make informed fueling decisions by comparing real-time gas prices from nearby stations, 
          factoring in both fuel costs and driving distance to maximize your savings.
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="bg-[#4CAF50] bg-opacity-10 p-4 rounded-full inline-block mb-4">
            <MapPin className="h-10 w-10 text-[#4CAF50]" />
          </div>
          <h3 className="text-xl font-bold text-[#333333] mb-3">Real-Time Prices</h3>
          <p className="text-gray-600">
            Access up-to-date fuel prices from gas stations in your vicinity using Google Maps integration.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="bg-[#4CAF50] bg-opacity-10 p-4 rounded-full inline-block mb-4">
            <DollarSign className="h-10 w-10 text-[#4CAF50]" />
          </div>
          <h3 className="text-xl font-bold text-[#333333] mb-3">Smart Savings</h3>
          <p className="text-gray-600">
            Calculate actual savings by comparing total costs including fuel prices and driving distance to each station.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="bg-[#4CAF50] bg-opacity-10 p-4 rounded-full inline-block mb-4">
            <Navigation className="h-10 w-10 text-[#4CAF50]" />
          </div>
          <h3 className="text-xl font-bold text-[#333333] mb-3">Easy Navigation</h3>
          <p className="text-gray-600">
            Get instant directions to your chosen gas station with one click through Google Maps integration.
          </p>
        </div>
      </div>

      {/* Quick Overview Section */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-4xl font-bold text-[#333333] mb-4">Smart Fuel Savings in 3 Steps</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          FuelWise analyzes real-time fuel prices and calculates the <strong>true cost</strong> of driving to each station. 
          We show you where to get the most fuel for your budget—not just the cheapest price per litre.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-[#4CAF50] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-2">Share Location</h3>
            <p className="text-gray-600 text-sm">Allow access to find nearby stations</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-[#4CAF50] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-2">Enter Details</h3>
            <p className="text-gray-600 text-sm">Budget and vehicle efficiency</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-[#4CAF50] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-2">Save Money</h3>
            <p className="text-gray-600 text-sm">Get real savings after travel costs</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-left mb-6">
          <p className="text-yellow-900 font-semibold mb-2">💡 Did you know?</p>
          <p className="text-yellow-800 text-sm">
            The nearest station isn't always the best deal. Driving 5 extra minutes can save you <strong>$3-5 per fill-up</strong>—
            that's <strong>$150-250 per year</strong> for weekly fill-ups!
          </p>
        </div>

        <Link 
          to="/how-it-works"
          className="inline-flex items-center bg-[#003366] hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          Learn How We Calculate Savings
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-[#333333] mb-8">Why Choose FuelWise?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Shield className="h-8 w-8 text-[#4CAF50] mx-auto mb-3" />
            <h3 className="font-bold text-[#333333] mb-2">Free to Use</h3>
            <p className="text-sm text-gray-600">No subscription fees, no hidden costs. Start saving immediately.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Clock className="h-8 w-8 text-[#4CAF50] mx-auto mb-3" />
            <h3 className="font-bold text-[#333333] mb-2">Save Time</h3>
            <p className="text-sm text-gray-600">Quick searches mean less time comparing prices and more time driving.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <DollarSign className="h-8 w-8 text-[#4CAF50] mx-auto mb-3" />
            <h3 className="font-bold text-[#333333] mb-2">Save Money</h3>
            <p className="text-sm text-gray-600">Find the best fuel deals and reduce your monthly fuel expenses.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Star className="h-8 w-8 text-[#4CAF50] mx-auto mb-3" />
            <h3 className="font-bold text-[#333333] mb-2">User Friendly</h3>
            <p className="text-sm text-gray-600">Simple, intuitive interface that anyone can use.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-[#003366] to-blue-800 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join FuelWise today and take control of your fuel expenses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
          >
            <UserPlus className="h-5 w-5" />
            <span>Create Free Account</span>
          </Link>
          
          <Link
            to="/search"
            className="bg-white hover:bg-gray-100 text-[#003366] py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
          >
            <Fuel className="h-5 w-5" />
            <span>Continue as Guest</span>
          </Link>
          
          <Link
            to="/login"
            className="bg-white hover:bg-gray-100 text-[#003366] py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-gray-300 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/privacy-policy" className="text-gray-600 hover:text-[#4CAF50] transition-colors duration-200">
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/terms-of-service" className="text-gray-600 hover:text-[#4CAF50] transition-colors duration-200">
            Terms of Service
          </Link>
          <span className="text-gray-400">•</span>
          <a href="https://mail.google.com/mail/?view=cm&to=fuelwiseapp@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#4CAF50] transition-colors duration-200">
            Contact Us
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} FuelWise. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

export default LandingPage;
