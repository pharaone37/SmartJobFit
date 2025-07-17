import { Link } from "react-router-dom";
import { Bot, Mail, ArrowRight, CheckCircle, Globe, Shield, Users, Zap, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { useTranslation } from "@/lib/i18n"; // Removed - using English only
import { 
  SiVisa, 
  SiMastercard, 
  SiAmericanexpress, 
  SiPaypal, 
  SiApple, 
  SiGooglepay
} from "react-icons/si";

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

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Stay Ahead in Your Career</h3>
            <p className="text-gray-400 mb-6">
              Get exclusive job market insights, AI-powered career tips, and be the first to know about new features.
            </p>
            
            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!email || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>50,000+ Subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Weekly Updates</span>
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
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
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
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/api-docs" className="hover:text-white transition-colors">API Documentation</Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Secure Payments */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Secure Payments</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <SiVisa className="w-8 h-8 text-blue-600" />
              <SiMastercard className="w-8 h-8 text-red-600" />
              <SiAmericanexpress className="w-8 h-8 text-blue-500" />
              <SiPaypal className="w-8 h-8 text-blue-400" />
              <SiApple className="w-8 h-8 text-gray-300" />
              <SiGooglepay className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-400 text-sm">
              All transactions are secure and encrypted. Your payment information is never stored on our servers.
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
  );
}
