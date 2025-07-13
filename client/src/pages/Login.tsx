import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import SocialLogin from "@/components/auth/SocialLogin";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check for error parameters in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    
    if (error === 'linkedin_failed') {
      toast({
        title: "LinkedIn Login Failed",
        description: "Unable to sign in with LinkedIn. Please try again or use email.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <SocialLogin />;
}