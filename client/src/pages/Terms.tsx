import { FileText, Shield, Users, Gavel, AlertTriangle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Please read these terms carefully before using SmartJobFit services
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 17, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Gavel className="w-6 h-6 text-blue-500" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using SmartJobFit, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                Use License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Permission is granted to temporarily use SmartJobFit for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-500" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for maintaining the confidentiality of your account.
              </p>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">You agree not to:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Use our service for any unlawful purpose</li>
                  <li>• Impersonate any person or entity</li>
                  <li>• Upload malicious code or content</li>
                  <li>• Interfere with or disrupt our services</li>
                  <li>• Collect or store personal data about other users</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We strive to provide continuous service availability, but we cannot guarantee 
                100% uptime. Our services may be temporarily unavailable due to maintenance, 
                updates, or technical issues.
              </p>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Limitations:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Free accounts have usage limits</li>
                  <li>• Premium features require active subscription</li>
                  <li>• API rate limits apply to all users</li>
                  <li>• We reserve the right to modify or discontinue services</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-500" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The SmartJobFit service and its original content, features, and functionality are 
                owned by SmartJobFit and are protected by international copyright, trademark, 
                patent, trade secret, and other intellectual property laws.
              </p>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Content:</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  You retain ownership of content you upload (resumes, profiles, etc.). By uploading 
                  content, you grant us a license to use, modify, and distribute it for the purpose 
                  of providing our services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Paid services are billed in advance on a monthly or annual basis. All payments are 
                processed securely through Stripe. Refunds are provided according to our refund policy.
              </p>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Billing:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Subscriptions auto-renew unless cancelled</li>
                  <li>• Price changes will be communicated 30 days in advance</li>
                  <li>• Failed payments may result in service suspension</li>
                  <li>• Cancellations take effect at the end of the current billing period</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                In no event shall SmartJobFit be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, 
                data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="text-gray-600 dark:text-gray-300">
                <p>Email: legal@smartjobfit.com</p>
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