import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Shield, Zap, Users } from "lucide-react";

export default function AuthPage() {
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        // User not authenticated, stay on page
      }
    };
    checkAuth();
  }, []);

  const handleSignIn = () => {
    window.location.href = "/enhanced-login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SmartJobFit
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find your dream job 10x faster with AI
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Welcome to SmartJobFit</CardTitle>
            <CardDescription>
              Join thousands of job seekers who found their perfect role with our AI-powered platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">AI-powered job matching</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Resume optimization & ATS scoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Interview preparation coaching</span>
              </div>
            </div>

            {/* Sign In Button */}
            <Button 
              onClick={handleSignIn}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Sign In to SmartJobFit
            </Button>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure authentication powered by{" "}
                <span className="font-medium">smartjobfit.com</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-purple-600 hover:text-purple-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:text-purple-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}