import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  Filter,
  X,
  Sparkles
} from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (params: any) => void;
  isLoading?: boolean;
}

export default function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const [searchParams, setSearchParams] = useState({
    keywords: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryMin: "",
    skills: [],
    companySize: "",
    remote: false
  });

  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const addQuickFilter = (filter: string) => {
    if (!quickFilters.includes(filter)) {
      setQuickFilters(prev => [...prev, filter]);
      
      // Apply filter logic
      switch (filter) {
        case "remote":
          setSearchParams(prev => ({ ...prev, remote: true }));
          break;
        case "full-time":
          setSearchParams(prev => ({ ...prev, jobType: "full-time" }));
          break;
        case "high-salary":
          setSearchParams(prev => ({ ...prev, salaryMin: "100000" }));
          break;
        default:
          break;
      }
    }
  };

  const removeQuickFilter = (filter: string) => {
    setQuickFilters(prev => prev.filter(f => f !== filter));
    
    // Remove filter logic
    switch (filter) {
      case "remote":
        setSearchParams(prev => ({ ...prev, remote: false }));
        break;
      case "full-time":
        setSearchParams(prev => ({ ...prev, jobType: "" }));
        break;
      case "high-salary":
        setSearchParams(prev => ({ ...prev, salaryMin: "" }));
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchParams({
      keywords: "",
      location: "",
      jobType: "",
      experienceLevel: "",
      salaryMin: "",
      skills: [],
      companySize: "",
      remote: false
    });
    setQuickFilters([]);
  };

  const quickFilterOptions = [
    { label: "Remote", value: "remote" },
    { label: "Full-time", value: "full-time" },
    { label: "$100k+", value: "high-salary" },
    { label: "Startup", value: "startup" },
    { label: "Tech", value: "tech" },
    { label: "Entry Level", value: "entry-level" },
    { label: "Senior", value: "senior" }
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <CardContent className="p-6 space-y-6">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Job title, keywords, or company"
              value={searchParams.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Location"
              value={searchParams.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Select value={searchParams.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="btn-gradient" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? "Searching..." : "AI Search"}
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Filters</h4>
            {quickFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFilterOptions.map((option) => (
              <Button
                key={option.value}
                variant={quickFilters.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  quickFilters.includes(option.value) 
                    ? removeQuickFilter(option.value)
                    : addQuickFilter(option.value)
                }
              >
                {option.label}
                {quickFilters.includes(option.value) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={searchParams.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
              <SelectTrigger>
                <Briefcase className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Minimum salary"
                type="number"
                value={searchParams.salaryMin}
                onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={searchParams.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Size</SelectItem>
                <SelectItem value="startup">Startup (1-50)</SelectItem>
                <SelectItem value="small">Small (51-200)</SelectItem>
                <SelectItem value="medium">Medium (201-1000)</SelectItem>
                <SelectItem value="large">Large (1000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Tips */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💡 Search Tips
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Use quotes for exact phrases: "product manager"</li>
            <li>• Combine keywords with OR: python OR javascript</li>
            <li>• Exclude terms with minus: -intern</li>
            <li>• Our AI automatically searches 15+ job boards simultaneously</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
