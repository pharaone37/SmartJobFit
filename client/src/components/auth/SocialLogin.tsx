import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Mail, User } from "lucide-react";

export default function SocialLogin() {
  const handleLinkedInLogin = () => {
    window.location.href = '/auth/linkedin';
  };

  const handleReplitLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to SmartJobFit</CardTitle>
          <CardDescription>
            Sign in to access AI-powered job search and career tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LinkedIn Login */}
          <Button 
            onClick={handleLinkedInLogin}
            className="w-full bg-[#0077B5] hover:bg-[#005885] text-white"
            size="lg"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            Continue with LinkedIn
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Replit Login */}
          <Button 
            onClick={handleReplitLogin}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Email
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}