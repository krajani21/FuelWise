import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#4CAF50] hover:text-green-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#4CAF50] bg-opacity-10 p-4 rounded-full">
              <FileText className="h-12 w-12 text-[#4CAF50]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#333333] mb-4 text-center">Terms of Service</h1>
          <p className="text-center text-gray-600 mb-8">Last Updated: November 8, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                Welcome to FuelWise! These Terms of Service ("Terms") govern your access to and use of the FuelWise website and services (collectively, the "Service") operated by FuelWise ("we," "us," or "our").
              </p>
              <p className="text-gray-600 mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                FuelWise is a web application that helps users find nearby gas stations and compare fuel prices based on their location. Our Service provides:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Real-time fuel price information from nearby gas stations</li>
                <li>Distance calculations and navigation assistance</li>
                <li>Cost comparison tools considering both fuel price and travel distance</li>
                <li>User accounts for saving vehicle information and search preferences</li>
                <li>Recent search history for registered users</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-[#333333] mb-3">3.1 Account Creation</h3>
              <p className="text-gray-600 mb-4">
                To access certain features, you may create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">3.2 Account Eligibility</h3>
              <p className="text-gray-600 mb-4">
                You must be at least 13 years old to create an account. If you are under 18, you must have parental or guardian consent to use the Service.
              </p>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">3.3 Account Termination</h3>
              <p className="text-gray-600 mb-4">
                We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">You agree NOT to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Collect user information without consent</li>
                <li>Engage in any fraudulent or deceptive practices</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Remove or modify any proprietary notices or labels</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">5. Location Services</h2>
              <p className="text-gray-600 mb-4">
                FuelWise requires access to your device's location to provide gas station search results. By using the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>You consent to sharing your location when you explicitly grant permission</li>
                <li>You can revoke location access at any time through your browser settings</li>
                <li>Guest users' locations are not stored on our servers</li>
                <li>Registered users' search locations are stored as described in our Privacy Policy</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Location accuracy depends on your device and browser capabilities. We are not responsible for inaccurate location data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">6. Third-Party Services and Content</h2>
              <p className="text-gray-600 mb-4">
                FuelWise integrates with third-party services including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Google Maps:</strong> For location services, gas station data, and navigation</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              </ul>
              <p className="text-gray-600 mb-4">
                These third-party services have their own terms of service and privacy policies. We are not responsible for the content, accuracy, or practices of these third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">7. Fuel Price Information</h2>
              <p className="text-gray-600 mb-4">
                <strong>Important Disclaimer:</strong> Fuel prices and gas station information displayed on FuelWise are provided by third-party sources, primarily Google Maps. We make reasonable efforts to provide accurate information, but:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Prices may not be current or accurate</li>
                <li>Gas stations may be temporarily closed or unavailable</li>
                <li>Actual prices at the pump may differ from displayed prices</li>
                <li>We do not guarantee the availability of fuel types shown</li>
                <li>Distance and navigation data may contain errors</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Always verify prices and availability before making fueling decisions. We are not responsible for any discrepancies between displayed and actual prices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content, features, and functionality are owned by FuelWise and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600 mb-4">
                You may not copy, modify, distribute, sell, or lease any part of our Service without our explicit written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-4">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted, timely, or error-free</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of information</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We do not warrant that the Service will meet your requirements or that any errors will be corrected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FUELWISE AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any loss of profits, revenue, data, or use</li>
                <li>Any damages resulting from your use or inability to use the Service</li>
                <li>Any damages resulting from inaccurate fuel price information</li>
                <li>Any damages from unauthorized access to your data</li>
                <li>Any damages from third-party services or content</li>
              </ul>
              <p className="text-gray-600 mb-4">
                This limitation applies regardless of the legal theory on which the claim is based, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">11. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to defend, indemnify, and hold harmless FuelWise and its affiliates from any claims, damages, losses, liabilities, costs, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another person or entity</li>
                <li>Any content you submit through the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">12. Privacy</h2>
              <p className="text-gray-600 mb-4">
                Your use of the Service is also governed by our Privacy Policy. Please review our <Link to="/privacy-policy" className="text-[#4CAF50] hover:underline font-semibold">Privacy Policy</Link> to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">13. Advertising</h2>
              <p className="text-gray-600 mb-4">
                FuelWise displays advertisements through Google AdSense. By using the Service, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Advertisements are provided by third parties</li>
                <li>We are not responsible for the content of advertisements</li>
                <li>Clicking on ads may redirect you to external websites</li>
                <li>You interact with advertisers at your own risk</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">14. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. If we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Post a notice on our website</li>
                <li>Notify registered users via email for significant changes</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">15. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">16. Severability</h2>
              <p className="text-gray-600 mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">17. Entire Agreement</h2>
              <p className="text-gray-600 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and FuelWise regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">18. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-100 rounded-lg p-6 mb-4">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> fuelwiseapp@gmail.com</p>
                <p className="text-gray-700 mb-2"><strong>Website:</strong> <a href="https://fuelwiseapp.com" className="text-[#4CAF50] hover:underline">https://fuelwiseapp.com</a></p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond to all inquiries within 5 business days</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">19. Acknowledgment</h2>
              <p className="text-gray-600 mb-4">
                BY USING FUELWISE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SERVICE.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-[#4CAF50] hover:text-green-600 font-semibold transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

