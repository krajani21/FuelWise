import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <Shield className="h-12 w-12 text-[#4CAF50]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#333333] mb-4 text-center">Privacy Policy</h1>
          <p className="text-center text-gray-600 mb-8">Last Updated: November 8, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to FuelWise ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application at fuelwiseapp.com (the "Service").
              </p>
              <p className="text-gray-600">
                By using FuelWise, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-[#333333] mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 mb-4">When you create an account with FuelWise, we collect:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Username:</strong> A display name for your account</li>
                <li><strong>Email Address:</strong> Used for account authentication, password recovery, and important service notifications</li>
                <li><strong>Password:</strong> Stored securely using industry-standard encryption (bcrypt hashing)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">2.2 Vehicle Information</h3>
              <p className="text-gray-600 mb-4">If you choose to save your vehicle profile, we collect:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Vehicle year, make, and model</li>
                <li>Fuel type preference (Regular, Premium, or Diesel)</li>
                <li>Tank capacity</li>
                <li>Preferred gas station brands</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">2.3 Location Data</h3>
              <p className="text-gray-600 mb-4">
                FuelWise requires your location to provide gas station search results. We collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Real-time GPS coordinates:</strong> Only when you actively use the "Get Location" feature</li>
                <li><strong>Country information:</strong> Auto-detected from your location to show relevant gas station brands</li>
                <li><strong>Search locations:</strong> Coordinates from your recent searches (stored only for registered users)</li>
              </ul>
              <p className="text-gray-600 mb-4">
                <strong>Important:</strong> Your location is only accessed when you explicitly grant permission through your browser. Guest users' locations are used in real-time for searches but are not stored on our servers.
              </p>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">2.4 Search History</h3>
              <p className="text-gray-600 mb-4">
                For registered users, we store your recent searches including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Fuel amount and vehicle efficiency used in searches</li>
                <li>Search timestamps</li>
                <li>Location coordinates where searches were performed</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We store only your 3 most recent searches to provide quick access to frequent queries.
              </p>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">2.5 Technical and Usage Data</h3>
              <p className="text-gray-600 mb-4">We automatically collect certain information when you use our Service:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Browser type and version</li>
                <li>Device information (type, operating system)</li>
                <li>IP address (for security and analytics purposes)</li>
                <li>Pages visited and features used</li>
                <li>Time and date of access</li>
                <li>Error logs and diagnostic data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Provide Service Functionality:</strong> Find nearby gas stations, calculate fuel costs, and display prices</li>
                <li><strong>Account Management:</strong> Create and maintain your user account, authenticate logins</li>
                <li><strong>Personalization:</strong> Save your vehicle information and preferences for faster searches</li>
                <li><strong>Communication:</strong> Send password reset emails and important service notifications</li>
                <li><strong>Improvement:</strong> Analyze usage patterns to improve our Service and user experience</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">4. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">FuelWise integrates with third-party services to provide functionality:</p>
              
              <h3 className="text-xl font-semibold text-[#333333] mb-3">4.1 Google Maps Platform</h3>
              <p className="text-gray-600 mb-4">
                We use Google Maps APIs (Places API, Distance Matrix API) to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Find nearby gas stations</li>
                <li>Retrieve fuel prices</li>
                <li>Calculate distances and navigation routes</li>
                <li>Display maps and directions</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Your location data is shared with Google Maps to provide these services. Please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] hover:underline">Google's Privacy Policy</a> for information on how they handle your data.
              </p>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">4.2 Google AdSense</h3>
              <p className="text-gray-600 mb-4">
                FuelWise uses Google AdSense to display advertisements. Google may use cookies and similar technologies to show ads based on your browsing history. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] hover:underline">Google Ad Settings</a>.
              </p>

              <h3 className="text-xl font-semibold text-[#333333] mb-3">4.3 Hosting and Database Services</h3>
              <p className="text-gray-600 mb-4">
                Our application is hosted on Vercel (frontend) and Render (backend), with data stored in MongoDB Atlas. These providers maintain their own security measures and privacy policies to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                <li><strong>Service Providers:</strong> With third-party services (like Google Maps) necessary to operate our Service</li>
                <li><strong>Legal Obligations:</strong> When required by law, court order, or governmental authority</li>
                <li><strong>Safety and Protection:</strong> To protect the rights, property, or safety of FuelWise, our users, or others</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">6. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Encryption:</strong> All passwords are hashed using bcrypt before storage</li>
                <li><strong>Secure Transmission:</strong> Data is transmitted over HTTPS encrypted connections</li>
                <li><strong>Authentication:</strong> JWT (JSON Web Tokens) for secure session management</li>
                <li><strong>Access Controls:</strong> Limited access to personal data by authorized personnel only</li>
                <li><strong>Regular Security Audits:</strong> Ongoing monitoring for vulnerabilities and threats</li>
              </ul>
              <p className="text-gray-600 mb-4">
                However, no method of transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Retained until you delete your account</li>
                <li><strong>Search History:</strong> Only the 3 most recent searches are retained; older searches are automatically deleted</li>
                <li><strong>Technical Logs:</strong> Retained for up to 90 days for security and debugging purposes</li>
              </ul>
              <p className="text-gray-600 mb-4">
                After account deletion, your personal information will be permanently removed from our active databases within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">8. Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information through your profile settings</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (if applicable)</li>
                <li><strong>Location Permissions:</strong> Revoke location access through your browser settings at any time</li>
              </ul>
              <p className="text-gray-600 mb-4">
                To exercise these rights, please contact us at the email provided in the Contact section below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">9. Guest Users</h2>
              <p className="text-gray-600 mb-4">
                You can use FuelWise without creating an account as a guest user. Guest users:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Must provide location access for each session</li>
                <li>Cannot save vehicle information or search history</li>
                <li>Have their location data used only for real-time searches (not stored)</li>
                <li>Are subject to the same privacy protections as registered users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                FuelWise is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">11. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 mb-4">
                FuelWise uses the following technologies:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Local Storage:</strong> To store authentication tokens and maintain your login session</li>
                <li><strong>Session Storage:</strong> For temporary data during your browsing session</li>
                <li><strong>Google AdSense Cookies:</strong> For displaying and personalizing advertisements</li>
                <li><strong>Google Maps Cookies:</strong> Required for map functionality</li>
              </ul>
              <p className="text-gray-600 mb-4">
                You can control cookies through your browser settings, but disabling them may limit Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">12. International Users</h2>
              <p className="text-gray-600 mb-4">
                FuelWise is operated from the United States. If you are accessing our Service from outside the US, please be aware that your information may be transferred to, stored, and processed in the US or other countries where our service providers operate. By using FuelWise, you consent to this transfer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Updating the "Last Updated" date at the top of this policy</li>
                <li>Posting a notice on our website</li>
                <li>Sending an email notification to registered users (for significant changes)</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Your continued use of FuelWise after changes are posted constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">14. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-100 rounded-lg p-6 mb-4">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> fuelwiseapp@gmail.com</p>
                <p className="text-gray-700 mb-2"><strong>Website:</strong> <a href="https://fuelwiseapp.com" className="text-[#4CAF50] hover:underline">https://fuelwiseapp.com</a></p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond to all inquiries within 5 business days</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">15. Your Consent</h2>
              <p className="text-gray-600 mb-4">
                By using FuelWise, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. If you do not agree with this Privacy Policy, please discontinue use of our Service immediately.
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

export default PrivacyPolicy;

