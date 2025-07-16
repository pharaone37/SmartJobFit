import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/LanguageProvider";

// Pages
import Landing from "@/pages/Landing";
import Homepage from "@/pages/Homepage";
import Dashboard from "@/pages/Dashboard";
import ImprovedDashboard from "@/pages/ImprovedDashboard";
import JobSearch from "@/pages/JobSearch";
import ResumeOptimization from "@/pages/ResumeOptimization";
import InterviewPrep from "@/pages/InterviewPrep";
import Analytics from "@/pages/Analytics";
import Pricing from "@/pages/Pricing";
import Subscribe from "@/pages/Subscribe";
import HelpCenter from "@/pages/HelpCenter";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import AuthPage from "@/pages/auth";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import AIResumeAnalyzer from "@/components/AIResumeAnalyzer";
import AIInterviewPrep from "@/components/AIInterviewPrep";
import AICoverLetterGenerator from "@/components/AICoverLetterGenerator";
import AICompanyInsights from "@/components/AICompanyInsights";
import AIDashboard from "@/components/AIDashboard";

// New Interactive Features
import ResumePreview from "@/components/ResumePreview";
import CareerMoodBoard from "@/components/CareerMoodBoard";
import SkillTracker from "@/components/SkillTracker";
import InterviewChatbot from "@/components/InterviewChatbot";
import NetworkSync from "@/components/NetworkSync";

// New AI Systems
import { JobSearchEngine } from "@/pages/JobSearchEngine";
import { ResumeOptimizer } from "@/pages/ResumeOptimizer";
import InterviewCoach from "@/pages/InterviewCoach";
import ApplicationTracker from "@/pages/ApplicationTracker";

import { queryClient } from "@/lib/queryClient";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Show navbar on all pages */}
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public routes accessible to all users */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<ImprovedDashboard />} />
                <Route path="/dashboard" element={<ImprovedDashboard />} />
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/resume" element={<ResumeOptimization />} />
                <Route path="/resume-analyzer" element={<AIResumeAnalyzer />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/ai-interview-prep" element={<AIInterviewPrep />} />
                <Route path="/cover-letter" element={<AICoverLetterGenerator />} />
                <Route path="/company-insights" element={<AICompanyInsights />} />
                <Route path="/ai-dashboard" element={<AIDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                
                {/* New AI Systems */}
                <Route path="/job-search-engine" element={<JobSearchEngine />} />
                <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
                <Route path="/interview-coach" element={<InterviewCoach />} />
                <Route path="/application-tracker" element={<ApplicationTracker />} />
                
                {/* New Interactive Features */}
                <Route path="/resume-preview" element={<ResumePreview />} />
                <Route path="/career-mood-board" element={<CareerMoodBoard />} />
                <Route path="/skill-tracker" element={<SkillTracker />} />
                <Route path="/interview-chatbot" element={<InterviewChatbot />} />
                <Route path="/network-sync" element={<NetworkSync />} />
                
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </main>
        {/* Show footer on all pages */}
        <Footer />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" storageKey="smartjobfit-theme">
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
