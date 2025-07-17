import { Shield, Lock, Eye, FileText, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect information you provide directly to us, such as when you create an account, 
                  upload your resume, or contact us for support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect information about how you use our services, including job searches, 
                  resume optimizations, and interview preparations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Device Information</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect information about the devices you use to access our services, 
                  including IP address, browser type, and operating system.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-500" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Provide and improve our AI-powered job search and career services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Personalize your experience and provide relevant job recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Communicate with you about our services and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Analyze usage patterns to improve our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Comply with legal obligations and protect our rights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-500" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• End-to-end encryption for all data transmission</li>
                <li>• Regular security audits and vulnerability assessments</li>
                <li>• Secure cloud storage with enterprise-grade protection</li>
                <li>• Two-factor authentication for enhanced account security</li>
                <li>• Limited access to personal data on a need-to-know basis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-green-500" />
                Your Rights (GDPR)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you are in the European Union, you have the following rights regarding your personal data:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li>• <strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                <li>• <strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li>• <strong>Right to Portability:</strong> Transfer your data to another service</li>
                <li>• <strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li>• <strong>Right to Restrict:</strong> Limit how we use your personal data</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                To exercise these rights, please contact us at privacy@smartjobfit.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-500" />
                International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                SmartJobFit operates globally. Your information may be transferred to and processed in 
                countries other than your own. We ensure appropriate safeguards are in place to protect 
                your data in accordance with this privacy policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
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