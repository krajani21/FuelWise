import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Mail, Shield, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#003366] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Fuel className="h-8 w-8 text-[#4CAF50]" />
              <span className="text-xl font-bold">FuelWise</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Smart fuel savings for everyone. Find the cheapest gas stations and optimize your fuel costs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm">
                  Search Fuel Prices
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://mail.google.com/mail/?view=cm&to=fuelwiseapp@gmail.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#4CAF50] transition-colors duration-200 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} FuelWise. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Made with passion for helping drivers save money on fuel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

