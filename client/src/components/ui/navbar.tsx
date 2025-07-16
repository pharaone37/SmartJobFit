import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, removeAuthToken } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/components/theme-provider";
// import { useTranslation } from "@/lib/i18n"; // Removed - using English only

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  FileText, 
  Video, 
  BarChart3, 
  CreditCard,
  User,
  Settings,
  LogOut,
  Bell
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    queryClient.clear();
    window.location.href = '/';
  };

  const navigationItems = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "Job Search", href: "/jobs", icon: Search },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Interview Prep", href: "/interview-prep", icon: Video },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const aiToolsItems = [
    { name: "Job Search Engine", href: "/job-search-engine", icon: Search },
    { name: "Resume Optimizer", href: "/resume-optimizer", icon: FileText },
    { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText },
    { name: "AI Interview Prep", href: "/ai-interview-prep", icon: Video },
    { name: "Interview Coach", href: "/interview-coach", icon: Video },
    { name: "Cover Letter", href: "/cover-letter", icon: FileText },
    { name: "Company Insights", href: "/company-insights", icon: Search },
  ];

  const publicNavigationItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "/faq" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SmartJobFit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                {publicNavigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </>
            ) : (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                        isActivePath(item.href)
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                          : "text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user?.firstName && (
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        )}
                        {user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                        <Badge variant="secondary" className="w-fit">
                          {user?.subscriptionPlan || "Free"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              {!isAuthenticated ? (
                <>
                  {publicNavigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/auth">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActivePath(item.href)
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                            : "text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
