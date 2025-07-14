import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
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
  // const { t } = useTranslation(); // Removed - using English only
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Secure Payments */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Secure Payments</h4>
            <div className="flex gap-3 mb-4">
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
        <div className="border-t border-gray-800 mt-12 pt-8">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
