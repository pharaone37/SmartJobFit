import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "@/components/JobCard";
import { JobRecommendationCarousel } from "@/components/JobRecommendationCarousel";
import JobSearchFilters, { JobSearchFilters as JobSearchFiltersType } from "@/components/JobSearchFilters";
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Star,
  Bookmark,
  Plus,
  Zap,
  Building,
  Users,
  TrendingUp,
  Sparkles,
  Target
} from "lucide-react";
import { Job } from "@shared/schema";

export default function JobSearch() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFiltersType>({});
  const [activeTab, setActiveTab] = useState("recommended");
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Mock job data for demonstration
  const mockJobs: Job[] = [
    {
      id: "job-1",
      title: "Senior React Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      description: "Looking for an experienced React developer to join our team...",
      salary: "$120,000 - $160,000",
      workType: "Full-time",
      remote: true,
      experienceLevel: "Senior",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      postedDate: new Date("2024-01-15"),
      url: "https://example.com/job-1",
      source: "internal",
      matchScore: 92,
      userId: user?.id || "user-1",
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "job-2",
      title: "Frontend Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      description: "Join our innovative team building the next generation of web applications...",
      salary: "$90,000 - $130,000",
      workType: "Full-time",
      remote: false,
      experienceLevel: "Mid-level",
      skills: ["Vue.js", "JavaScript", "CSS", "REST APIs"],
      postedDate: new Date("2024-01-14"),
      url: "https://example.com/job-2",
      source: "internal",
      matchScore: 85,
      userId: user?.id || "user-1",
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "job-3",
      title: "Full Stack Developer",
      company: "InnovateTech",
      location: "Austin, TX",
      description: "We're seeking a versatile full-stack developer to work on cutting-edge projects...",
      salary: "$100,000 - $140,000",
      workType: "Full-time",
      remote: true,
      experienceLevel: "Mid-level",
      skills: ["React", "Node.js", "Python", "PostgreSQL"],
      postedDate: new Date("2024-01-13"),
      url: "https://example.com/job-3",
      source: "internal",
      matchScore: 78,
      userId: user?.id || "user-1",
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Job search query
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['/api/jobs', searchQuery, filters],
    queryFn: async () => {
      // For now, return mock data
      return mockJobs.filter(job => 
        !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // Job recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/jobs/recommendations'],
    queryFn: async () => {
      // Return mock recommendations sorted by match score
      return mockJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    },
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // Saved jobs
  const { data: savedJobs, isLoading: savedJobsLoading } = useQuery({
    queryKey: ['/api/saved-jobs'],
    queryFn: async () => {
      // Return mock saved jobs
      return mockJobs.filter(job => bookmarkedJobs.includes(job.id));
    },
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // Handle search
  const handleSearch = () => {
    refetchJobs();
  };

  // Handle bookmark/unbookmark
  const handleBookmark = async (jobId: string) => {
    const isBookmarked = bookmarkedJobs.includes(jobId);
    
    if (isBookmarked) {
      setBookmarkedJobs(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job Removed",
        description: "Job removed from your bookmarks",
      });
    } else {
      setBookmarkedJobs(prev => [...prev, jobId]);
      toast({
        title: "Job Bookmarked",
        description: "Job added to your bookmarks",
      });
    }
    
    // Invalidate saved jobs query
    queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
  };

  // Handle apply
  const handleApply = (jobId: string) => {
    toast({
      title: "Application Started",
      description: "Redirecting to application page...",
    });
    // In a real app, this would redirect to application flow
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const JobSkeletons = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <Skeleton className="w-16 h-16 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-18" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Job Search</h1>
              <p className="text-gray-600 dark:text-gray-400">AI-powered job matching and recommendations</p>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <JobSearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            isLoading={jobsLoading}
          />
        </div>

        {/* Smart Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <JobRecommendationCarousel
              jobs={recommendations}
              onBookmark={handleBookmark}
              onApply={handleApply}
              bookmarkedJobs={bookmarkedJobs}
              title="Smart Job Recommendations"
              subtitle="AI-powered matches based on your profile and preferences"
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommended
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Results
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved Jobs
            </TabsTrigger>
          </TabsList>

          {/* Recommended Jobs */}
          <TabsContent value="recommended" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Personalized Job Recommendations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Jobs matched to your skills, experience, and preferences
              </p>
            </div>
            
            {recommendationsLoading ? (
              <JobSkeletons />
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid gap-6">
                {recommendations.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onBookmark={handleBookmark}
                    onApply={handleApply}
                    isBookmarked={bookmarkedJobs.includes(job.id)}
                    showMatchScore={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No recommendations yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Complete your profile to get AI-powered job recommendations
                </p>
                <Button onClick={() => window.location.href = "/dashboard"}>
                  Complete Profile
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Search Results */}
          <TabsContent value="search" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {jobs ? `Found ${jobs.length} jobs` : "Search for jobs using the form above"}
              </p>
            </div>

            {jobsLoading ? (
              <JobSkeletons />
            ) : jobs && jobs.length > 0 ? (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onBookmark={handleBookmark}
                    onApply={handleApply}
                    isBookmarked={bookmarkedJobs.includes(job.id)}
                    showMatchScore={false}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Saved Jobs */}
          <TabsContent value="saved" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Saved Jobs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Jobs you've bookmarked for later review
              </p>
            </div>

            {savedJobsLoading ? (
              <JobSkeletons />
            ) : savedJobs && savedJobs.length > 0 ? (
              <div className="grid gap-6">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onBookmark={handleBookmark}
                    onApply={handleApply}
                    isBookmarked={true}
                    showMatchScore={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No saved jobs yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Bookmark jobs you're interested in to save them for later
                </p>
                <Button onClick={() => setActiveTab("recommended")}>
                  Explore Recommendations
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}