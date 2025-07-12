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

interface JobSearchFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
}

export default function JobSearch() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>({});
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

  // Search jobs query
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ["/api/jobs", searchQuery, filters],
    retry: false,
    enabled: isAuthenticated,
    meta: {
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
      }
    }
  });

  // Job recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/jobs/recommendations"],
    retry: false,
    enabled: isAuthenticated,
  });

  // Saved jobs
  const { data: savedJobs, isLoading: savedJobsLoading } = useQuery({
    queryKey: ["/api/saved-jobs"],
    retry: false,
    enabled: isAuthenticated,
  });

  // External job search mutation
  const externalSearchMutation = useMutation({
    mutationFn: async (searchData: any) => {
      return await apiRequest("POST", "/api/jobs/search", searchData);
    },
    onSuccess: () => {
      toast({
        title: "Search Complete",
        description: "Found new jobs from external sources!",
      });
      refetchJobs();
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
        title: "Search Failed",
        description: "Could not search external job boards. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const handleSearch = () => {
    refetchJobs();
  };

  const handleAISearch = () => {
    externalSearchMutation.mutate({
      keywords: searchQuery,
      location: filters.location,
      jobType: filters.jobType,
      experienceLevel: filters.experienceLevel,
      salaryMin: filters.salaryMin,
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Job title or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Location"
                  value={filters.location || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Select value={filters.experienceLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
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
            
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white dark:bg-gray-800">
                <MapPin className="w-3 h-3 mr-1" />
                Remote
              </Badge>
              <Badge variant="outline" className="bg-white dark:bg-gray-800">
                <DollarSign className="w-3 h-3 mr-1" />
                $100k+
              </Badge>
              <Badge variant="outline" className="bg-white dark:bg-gray-800">
                <Building className="w-3 h-3 mr-1" />
                Tech
              </Badge>
              <Badge variant="outline" className="bg-white dark:bg-gray-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Startup
              </Badge>
            </div>
          </CardContent>
        </Card>

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
