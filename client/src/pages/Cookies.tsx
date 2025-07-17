import { Cookie, Shield, Settings, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Cookie className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn about how we use cookies and similar technologies on SmartJobFit
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 17, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-500" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-500" />
                How We Use Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies are necessary for the website to function properly. They enable basic features 
                  like page navigation, access to secure areas, and authentication.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Functionality Cookies</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and providing personalized content.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Marketing Cookies</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies are used to deliver advertisements that are relevant to you and your interests. 
                  They may also be used to limit the number of times you see an advertisement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-500" />
                Cookies We Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Authentication Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <strong>Purpose:</strong> Keep you logged in and secure<br />
                    <strong>Duration:</strong> Session or until logout<br />
                    <strong>Type:</strong> Essential
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Preference Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <strong>Purpose:</strong> Remember your settings and preferences<br />
                    <strong>Duration:</strong> Up to 1 year<br />
                    <strong>Type:</strong> Functionality
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <strong>Purpose:</strong> Help us improve our services<br />
                    <strong>Duration:</strong> Up to 2 years<br />
                    <strong>Type:</strong> Analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-500" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your computer and you can set most browsers to prevent them from being placed.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Browser Settings</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Most web browsers allow you to control cookies through their settings preferences. 
                    You can typically find these in the "Options" or "Preferences" menu.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Our Cookie Banner</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    When you first visit our website, you'll see a cookie banner where you can accept 
                    or decline non-essential cookies.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Current Cookie Settings</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  You can manage your cookie preferences at any time by clicking the button below.
                </p>
                <Button 
                  onClick={() => {
                    localStorage.removeItem('cookieConsent');
                    window.location.reload();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Manage Cookie Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We may also use third-party services that set cookies on your device. These services include:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li>• <strong>Stripe:</strong> For secure payment processing</li>
                <li>• <strong>Intercom:</strong> For customer support and communication</li>
                <li>• <strong>Hotjar:</strong> For user experience analysis</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                These third-party services have their own privacy policies and cookie practices. 
                We recommend reviewing their policies to understand how they use cookies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Cookie Policy from time to time. We will notify you of any changes 
                by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="text-gray-600 dark:text-gray-300">
                <p>Email: privacy@smartjobfit.com</p>
                <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}