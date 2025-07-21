import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, Mail, ArrowRight, CheckCircle, Globe, Shield, Users, Zap, Linkedin, X, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useTranslation } from "@/lib/i18n"; // Removed - using English only
import { 
  SiVisa, 
  SiMastercard, 
  SiAmericanexpress, 
  SiPaypal, 
  SiApple, 
  SiGooglepay,
  SiStripe
} from "react-icons/si";

import { CookieConsent } from './cookie-consent';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    // Simulate API call - will be connected to CRM later
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, just show success state
    setIsSubscribed(true);
    setEmail('');
    setIsLoading(false);
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const handleCookieAccept = (preferences: any) => {
    console.log('Cookie preferences accepted:', preferences);
    // Here you would typically initialize analytics/tracking based on preferences
  };

  const handleCookieDecline = () => {
    console.log('Cookies declined');
    // Here you would disable non-essential tracking
  };

  return (
    <>
      <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Enhanced Newsletter Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.3))]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
              {/* Enhanced Header */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-gray-900" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                🚀 Stay Ahead in Your Career
              </h3>
              <p className="text-lg text-gray-300 mb-8">
                Get exclusive job market insights, AI-powered career tips, and early access to revolutionary features that will transform your career.
              </p>
              
              {/* Enhanced Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg backdrop-blur-sm bg-[#ffffff]"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!email || isLoading}
                  className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isSubscribed ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
              
              {/* Enhanced Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Growing Community</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Weekly Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">SmartJobFit</span>
              </div>
              <p className="text-gray-400">
                The future of job search is here. Find your dream job 10x faster with AI-powered matching and optimization.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/job-search" className="hover:text-white transition-colors">Job Search</Link></li>
                <li><Link to="/resume-optimizer" className="hover:text-white transition-colors">Resume Optimizer</Link></li>
                <li><Link to="/interview-coach" className="hover:text-white transition-colors">Interview Coach</Link></li>
                <li><Link to="/career-coaching" className="hover:text-white transition-colors">Career Coaching</Link></li>
                <li><Link to="/salary-intelligence" className="hover:text-white transition-colors">Salary Intelligence</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>

            {/* Worldwide Payment Methods */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Secure Global Payments</h4>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {/* Major Credit Cards */}
                <SiVisa className="w-8 h-8 text-blue-600" />
                <SiMastercard className="w-8 h-8 text-red-600" />
                <SiAmericanexpress className="w-8 h-8 text-blue-500" />
                <Star className="w-8 h-8 text-orange-500" />
                
                {/* Digital Wallets */}
                <SiPaypal className="w-8 h-8 text-blue-400" />
                <SiApple className="w-8 h-8 text-gray-300" />
                <SiGooglepay className="w-8 h-8 text-green-500" />
                <SiStripe className="w-8 h-8 text-purple-500" />
                
                {/* Additional Methods */}
                <Globe className="w-8 h-8 text-blue-400" />
                <Shield className="w-8 h-8 text-green-500" />
                <Users className="w-8 h-8 text-purple-400" />
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-gray-400 text-sm">
                Powered by Stripe. All transactions are secure and encrypted worldwide.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 SmartJobFit. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}