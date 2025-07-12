import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  MapPin,
  Clock,
  Bookmark,
  Grid,
  List,
  Zap
} from "lucide-react";
import { useJobSearch, useJobRecommendations } from "@/hooks/useJobs";
import { JobSearchFilters } from "@/lib/types";
import { JobCard } from "@/components/job/job-card";
import { JobFilters } from "@/components/job/job-filters";
import { useLocation } from "wouter";

export default function JobSearch() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());

  // Get query params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, []);

  const { data: searchResults, isLoading, error } = useJobSearch(
    searchQuery, 
    filters, 
    page, 
    20
  );

  const { data: recommendations, isLoading: recommendationsLoading } = useJobRecommendations(5);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setLocation(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleFiltersChange = (newFilters: JobSearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const jobs = searchResults?.jobs || [];
  const hasResults = jobs.length > 0;
  const hasQuery = searchQuery.trim().length > 0 || Object.keys(filters).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-muted-foreground">
            Search across 15+ job boards with AI-powered matching
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job titles, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </Button>
                <Button 
                  onClick={() => handleSearch(searchQuery)}
                  className="button-gradient"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  AI Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <JobFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'Searching...' : (
                    hasResults ? 
                    `${searchResults.total} jobs found${searchQuery ? ` for "${searchQuery}"` : ''}` :
                    hasQuery ? 'No jobs found' : 'Start searching to see results'
                  )}
                </p>
                {searchResults?.page && searchResults.page > 1 && (
                  <Badge variant="outline">
                    Page {searchResults.page}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results */}
            {!hasQuery && !isLoading && (
              <div className="space-y-6">
                {/* Recommended Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bookmark className="h-5 w-5 text-primary" />
                      <span>Recommended for You</span>
                    </CardTitle>
                    <CardDescription>
                      Jobs that match your profile and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recommendationsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-start space-x-4">
                              <Skeleton className="h-12 w-12 rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <Skeleton className="h-6 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
                        {(recommendations || []).map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            showMatchScore={true}
                            onBookmark={handleBookmark}
                            isBookmarked={bookmarkedJobs.has(job.id)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Search Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Searches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Product Manager',
                        'Software Engineer',
                        'UX Designer',
                        'Data Scientist',
                        'DevOps Engineer',
                        'Frontend Developer',
                        'Backend Developer',
                        'Marketing Manager'
                      ].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(term)}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-full" />
                          <div className="flex space-x-2 mt-3">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-red-500 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Search Error</h3>
                  <p className="text-muted-foreground mb-4">
                    {error.message || 'Failed to search jobs. Please try again.'}
                  </p>
                  <Button onClick={() => handleSearch(searchQuery)}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasQuery && !isLoading && jobs.length === 0 && !error && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters to find more results.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" onClick={() => setFilters({})}>
                      Clear Filters
                    </Button>
                    <Button onClick={() => handleSearch('')}>
                      View All Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasResults && !isLoading && (
              <div className="space-y-6">
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      showMatchScore={true}
                      onBookmark={handleBookmark}
                      isBookmarked={bookmarkedJobs.has(job.id)}
                    />
                  ))}
                </div>

                {/* Load More */}
                {searchResults?.hasMore && (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Load More Jobs'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
