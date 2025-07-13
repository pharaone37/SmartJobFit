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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "@/components/JobCard";
import JobSearchFilters from "@/components/JobSearchFilters";
import type { JobSearchFilters as JobSearchFiltersType } from "@/components/JobSearchFilters";
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
  TrendingUp
} from "lucide-react";

export default function JobSearch() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFiltersType>({});
  const [activeTab, setActiveTab] = useState("search");

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

  // Live API job search
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['/api/jobs', searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
      if (filters.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
      
      const response = await apiRequest('GET', `/api/jobs?${params.toString()}`);
      return response.json();
    },
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // Job recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/jobs/recommendations'],
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // Saved jobs
  const { data: savedJobs, isLoading: savedJobsLoading } = useQuery({
    queryKey: ['/api/saved-jobs'],
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  // External job search mutation
  const externalSearchMutation = useMutation({
    mutationFn: async (searchData: { keywords: string; location?: string; jobType?: string; experienceLevel?: string; salaryMin?: number; limit?: number }) => {
      const response = await apiRequest('POST', '/api/jobs/search', searchData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "External Search Complete",
        description: `Found ${data.length} new jobs from external sources`,
      });
      // Refetch the main jobs list to include new results
      refetchJobs();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      console.error('External search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search external job boards. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle search form submission
  const handleSearch = () => {
    refetchJobs();
  };

  // Handle external search
  const handleExternalSearch = () => {
    externalSearchMutation.mutate({
      keywords: searchQuery,
      location: filters.location,
      jobType: filters.jobType,
      experienceLevel: filters.experienceLevel,
      salaryMin: filters.salaryMin,
      limit: 20
    });
  };

  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return await apiRequest("POST", "/api/saved-jobs", { jobId });
    },
    onSuccess: () => {
      toast({
        title: "Job Saved",
        description: "Job added to your saved list!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Save Failed",
        description: "Could not save job. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAISearch = () => {
    externalSearchMutation.mutate({
      keywords: searchQuery,
      location: filters.location,
      jobType: filters.jobType,
      experienceLevel: filters.experienceLevel,
      salaryMin: filters.salaryMin,
      salaryMax: filters.salaryMax,
      remote: filters.remote,
      skills: filters.skills,
      platforms: filters.platforms,
      limit: 50
    });
  };

  const handleSaveJob = (jobId: string) => {
    saveJobMutation.mutate(jobId);
  };

  const JobSkeletons = () => (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
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
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Search</h1>
          <p className="text-muted-foreground">Find your next opportunity with AI-powered matching</p>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Job title or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Button 
                onClick={handleAISearch} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={externalSearchMutation.isPending}
              >
                <Zap className="w-4 h-4 mr-2" />
                AI Search
              </Button>
            </div>
          </div>
          
          <JobSearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            isLoading={jobsLoading || externalSearchMutation.isPending}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          {/* Search Results */}
          <TabsContent value="search" className="mt-6">
            {jobsLoading ? (
              <JobSkeletons />
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={() => handleSaveJob(job.id)}
                    isSaved={savedJobs?.some((saved: any) => saved.jobId === job.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or use AI Search to find more opportunities
                </p>
                <Button onClick={handleAISearch} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Search
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Recommended Jobs */}
          <TabsContent value="recommended" className="mt-6">
            {recommendationsLoading ? (
              <JobSkeletons />
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={() => handleSaveJob(job.id)}
                    isSaved={savedJobs?.some((saved: any) => saved.jobId === job.id)}
                    showMatchScore={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your profile and upload a resume to get personalized job recommendations
                </p>
                <Button>
                  Complete Profile
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Saved Jobs */}
          <TabsContent value="saved" className="mt-6">
            {savedJobsLoading ? (
              <JobSkeletons />
            ) : savedJobs && savedJobs.length > 0 ? (
              <div className="space-y-6">
                {savedJobs.map((savedJob: any) => (
                  <JobCard
                    key={savedJob.id}
                    job={savedJob.job}
                    onSave={() => handleSaveJob(savedJob.job.id)}
                    isSaved={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
                <p className="text-muted-foreground mb-4">
                  Save interesting jobs to review and apply to them later
                </p>
                <Button onClick={() => setActiveTab("search")}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
