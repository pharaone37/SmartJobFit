import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Briefcase, DollarSign, Clock, Building, Bookmark, Filter, ChevronDown } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  postedAt: string;
  applicationUrl: string;
  source: string;
  isRemote: boolean;
  benefits?: string[];
}

interface SearchFilters {
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  jobType?: string;
  experienceLevel?: string;
  company?: string;
  industry?: string;
  skills?: string[];
  radius?: number;
  datePosted?: string;
}

export function JobSearchEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search suggestions query
  const { data: searchSuggestions } = useQuery({
    queryKey: ['/api/search/suggestions', searchQuery],
    enabled: searchQuery.length > 2,
    retry: false,
  });

  // Main search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchData: { query: string; filters?: SearchFilters; limit?: number; offset?: number }) => {
      const response = await apiRequest('/api/search/jobs', {
        method: 'POST',
        body: JSON.stringify(searchData),
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setSearchResults(data.jobs || []);
        setTotalResults(data.totalResults || 0);
        toast({
          title: "Search Complete",
          description: `Found ${data.totalResults} jobs matching your criteria`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: "Failed to search jobs. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: async (jobData: { jobId: string; notes?: string }) => {
      return await apiRequest('/api/jobs/save', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Job Saved",
        description: "Job saved to your profile successfully",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle search
  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    const searchData = {
      query: query.trim(),
      ...filters,
      limit: 20,
      offset: (currentPage - 1) * 20,
    };

    searchMutation.mutate(searchData);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle save job
  const handleSaveJob = (jobId: string) => {
    saveJobMutation.mutate({ jobId });
  };

  // Update suggestions based on search input
  useEffect(() => {
    if (searchSuggestions?.success) {
      setSuggestions(searchSuggestions.suggestions || []);
    }
  }, [searchSuggestions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI-Powered Job Search Engine
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find your dream job with intelligent matching and comprehensive search
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs by title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
              {suggestions.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setSuggestions([]);
                        handleSearch(suggestion);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleSearch()}
                disabled={searchMutation.isPending}
                className="min-w-[120px]"
              >
                {searchMutation.isPending ? 'Searching...' : 'Search Jobs'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, State, or Country"
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={filters.jobType || ''}
                    onValueChange={(value) => handleFilterChange('jobType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={filters.experienceLevel || ''}
                    onValueChange={(value) => handleFilterChange('experienceLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry-level">Entry Level</SelectItem>
                      <SelectItem value="mid-level">Mid Level</SelectItem>
                      <SelectItem value="senior-level">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Min salary"
                        value={filters.salaryMin || ''}
                        onChange={(e) => handleFilterChange('salaryMin', parseInt(e.target.value) || undefined)}
                      />
                      <span className="text-gray-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max salary"
                        value={filters.salaryMax || ''}
                        onChange={(e) => handleFilterChange('salaryMax', parseInt(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={filters.company || ''}
                      onChange={(e) => handleFilterChange('company', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={filters.remote || false}
                    onCheckedChange={(checked) => handleFilterChange('remote', checked)}
                  />
                  <Label htmlFor="remote">Remote work only</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalResults} jobs found
                </p>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-4">
                  {searchResults.map((job) => (
                    <Card 
                      key={job.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Building className="h-4 w-4" />
                              {job.company}
                              <Separator orientation="vertical" className="h-4" />
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(job.id);
                            }}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{job.jobType}</Badge>
                          <Badge variant="outline">{job.experienceLevel}</Badge>
                          {job.isRemote && <Badge variant="default">Remote</Badge>}
                          <Badge variant="outline">{job.source}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(job.postedAt).toLocaleDateString()}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {searchResults.length === 0 && !searchMutation.isPending && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No jobs found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search terms or filters
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg sticky top-6">
              {selectedJob ? (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedJob.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedJob.company} • {selectedJob.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{selectedJob.jobType}</Badge>
                      <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                      {selectedJob.isRemote && <Badge variant="default">Remote</Badge>}
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Job Description
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Benefits
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {selectedJob.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => window.open(selectedJob.applicationUrl, '_blank')}
                      >
                        Apply Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleSaveJob(selectedJob.id)}
                        disabled={saveJobMutation.isPending}
                      >
                        {saveJobMutation.isPending ? 'Saving...' : 'Save Job'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a job
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Click on a job from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}