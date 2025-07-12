import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/LanguageProvider";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import JobSearch from "@/pages/JobSearch";
import ResumeOptimization from "@/pages/ResumeOptimization";
import InterviewPrep from "@/pages/InterviewPrep";
import Analytics from "@/pages/Analytics";
import Pricing from "@/pages/Pricing";
import Subscribe from "@/pages/Subscribe";
import HelpCenter from "@/pages/HelpCenter";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
        {/* Only show main navbar for authenticated users */}
        {isAuthenticated && <Navbar />}
        <main className="flex-1">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Landing />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/resume" element={<ResumeOptimization />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </main>
        {/* Only show footer for authenticated users */}
        {isAuthenticated && <Footer />}
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
