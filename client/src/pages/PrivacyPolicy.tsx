import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Lock, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Settings,
  Download,
  Trash2,
  Eye,
  UserCheck
} from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            SmartJobFit is committed to protecting your privacy and ensuring GDPR compliance
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This privacy policy explains how SmartJobFit ("we", "us", "our") collects, uses, and protects your personal information in accordance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Data Controller */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                1. Data Controller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <strong>SmartJobFit</strong> is the data controller responsible for your personal information.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium mb-2">Contact Information:</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email: privacy@smartjobfit.com
                    </p>
                    <p className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website: smartjobfit.com
                    </p>
                    <p className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Data Protection Officer: dpo@smartjobfit.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                2. Legal Basis for Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>We process your personal data based on the following legal grounds:</p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Consent (Article 6(1)(a) GDPR)</p>
                      <p className="text-sm text-muted-foreground">When you explicitly consent to specific processing activities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Contract Performance (Article 6(1)(b) GDPR)</p>
                      <p className="text-sm text-muted-foreground">To provide our job search and career services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Legitimate Interests (Article 6(1)(f) GDPR)</p>
                      <p className="text-sm text-muted-foreground">For improving our services and business operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                3. Personal Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Account Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      Name, email address, phone number
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      Profile picture and professional information
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      Account preferences and settings
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Career Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      Resume and CV content
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      Work history, education, and skills
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      Job search preferences and criteria
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      Application history and tracking data
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Usage Data</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      Platform usage statistics and analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      Interview recordings (with explicit consent)
                    </li>
                    <li className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      Device information and IP addresses
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                4. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Service Provision</h4>
                    <p className="text-sm text-muted-foreground">
                      Providing job search, resume optimization, interview preparation, and career coaching services
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">AI-Powered Matching</h4>
                    <p className="text-sm text-muted-foreground">
                      Using AI algorithms to match you with relevant job opportunities and career advice
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Sending job alerts, notifications, and service updates
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Service Improvement</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyzing usage patterns to improve our platform and AI algorithms
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                5. Data Sharing and Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h4 className="font-medium">We may share your data with:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Employers when you apply for jobs (with your consent)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Service providers who assist in our operations (under strict contracts)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Legal authorities when required by law
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                6. Your Rights Under GDPR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have the following rights regarding your personal data:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Right of Access</p>
                      <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Settings className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Right of Rectification</p>
                      <p className="text-sm text-muted-foreground">Correct inaccurate or incomplete data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Right of Erasure</p>
                      <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Download className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Right of Portability</p>
                      <p className="text-sm text-muted-foreground">Export your data in a machine-readable format</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="font-medium mb-2">Exercise Your Rights</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    To exercise any of these rights, contact us at privacy@smartjobfit.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We will respond to your request within 30 days as required by GDPR.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                7. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>We implement comprehensive security measures to protect your data:</p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Regular security audits</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Access controls and authentication</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">GDPR-compliant data processing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                8. Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Account Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Retained while your account is active and for 2 years after account closure
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Resume and Application Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Retained for 3 years or until you request deletion
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">Analytics Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Anonymized after 12 months and retained for statistical purposes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                9. International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
                  We ensure adequate protection through:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Standard Contractual Clauses (SCCs)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Adequacy decisions by the European Commission
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Binding Corporate Rules (where applicable)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Complaints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                10. Contact Us & Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Privacy Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      For privacy-related inquiries: privacy@smartjobfit.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Data Protection Officer</h4>
                    <p className="text-sm text-muted-foreground">
                      For data protection matters: dpo@smartjobfit.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Supervisory Authority</h4>
                    <p className="text-sm text-muted-foreground">
                      You have the right to lodge a complaint with your local data protection authority
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="flex justify-center gap-4">
            <Link href="/terms-of-service">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
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