import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Lock, 
  Clock, 
  Mail, 
  Globe, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings,
  CreditCard,
  UserCheck,
  Zap,
  Building,
  Scale,
  Ban,
  Info,
  BookOpen
} from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Legal terms and conditions for using SmartJobFit's AI-powered career platform
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="gap-1">
              <Scale className="h-3 w-3" />
              Legal Agreement
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            By accessing and using SmartJobFit ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                1. Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  SmartJobFit is an AI-powered career platform that provides:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>AI-powered job search and matching</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Resume optimization and ATS scoring</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span>Interview preparation and coaching</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span>Career analytics and insights</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Automated job application services</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                2. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  By creating an account, accessing, or using SmartJobFit, you acknowledge that:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>You have read, understood, and agree to these Terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>You are at least 18 years old or have parental consent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>You have the legal capacity to enter into this agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>You will comply with all applicable laws and regulations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Account Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Provide accurate, current, and complete information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Maintain and update your account information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Keep your login credentials secure and confidential</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Notify us immediately of any unauthorized access</span>
                    </li>
                  </ul>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You are responsible for all activities that occur under your account. One account per person is permitted.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                4. Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Permitted Uses</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Personal career development and job searching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Resume optimization and interview preparation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Legitimate job applications and networking</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-600">Prohibited Uses</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Ban className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Submitting false, misleading, or fraudulent information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Attempting to circumvent security measures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Reverse engineering or copying our AI algorithms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Violating any applicable laws or regulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Harassment, discrimination, or abusive behavior</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                5. Subscription and Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium mb-2">Free Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Limited access to basic features with usage restrictions
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-medium mb-2">Premium Plan (€39/month)</h4>
                    <p className="text-sm text-muted-foreground">
                      Full access to all features including AI automation and advanced analytics
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Billing Terms</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Subscriptions renew automatically unless cancelled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>You may cancel your subscription at any time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>No refunds for partial months, but access continues until period end</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Prices may change with 30 days notice</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                6. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">SmartJobFit Ownership</h4>
                  <p className="text-sm text-muted-foreground">
                    All rights, title, and interest in the Service, including AI algorithms, software, content, and trademarks, remain with SmartJobFit.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">User Content</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain ownership of your resume, personal information, and other content you provide. You grant us a license to use this content solely to provide our services.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">AI-Generated Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Content generated by our AI (cover letters, optimized resumes, interview questions) is provided for your use, but the underlying algorithms remain our intellectual property.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                7. Data Privacy and Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Your privacy is important to us. Our data practices are governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>GDPR-compliant data processing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>End-to-end encryption for sensitive data</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Right to access, modify, or delete your data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                8. Service Availability and Modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service availability.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Service Modifications</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>We may modify, suspend, or discontinue features with notice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Scheduled maintenance will be announced in advance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Emergency maintenance may occur without notice</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                9. Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    SmartJobFit is a career assistance tool. We do not guarantee job placement, interview success, or specific career outcomes.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Service Limitations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>AI recommendations are suggestions, not guarantees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Job market conditions may affect results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Third-party job boards may have different terms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                10. Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Account Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    Either party may terminate this agreement at any time:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>You may delete your account at any time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>We may suspend accounts for terms violations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Data will be deleted according to our Privacy Policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                11. Governing Law and Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Jurisdiction</h4>
                  <p className="text-sm text-muted-foreground">
                    These Terms are governed by the laws of the European Union and the jurisdiction where SmartJobFit operates.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Dispute Resolution</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Disputes will be resolved through binding arbitration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Small claims court remains available for qualifying disputes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>EU consumers retain rights under applicable consumer protection laws</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                12. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Legal Inquiries</h4>
                    <p className="text-sm text-muted-foreground">
                      For questions about these Terms: legal@smartjobfit.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">General Support</h4>
                    <p className="text-sm text-muted-foreground">
                      For support and assistance: support@smartjobfit.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Business Address</h4>
                    <p className="text-sm text-muted-foreground">
                      SmartJobFit<br />
                      [Business Address]<br />
                      [City, Country]
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="flex justify-center gap-4">
            <Link href="/privacy-policy">
              <Button variant="outline" className="gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                FAQ & Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}