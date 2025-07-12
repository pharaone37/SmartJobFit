import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await apiRequest("DELETE", `/api/saved-jobs/${job.id}`);
      } else {
        await apiRequest("POST", "/api/saved-jobs", { jobId: job.id });
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Job Unsaved" : "Job Saved",
        description: isSaved 
          ? "Job removed from your saved list." 
          : "Job added to your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/applications", { 
        jobId: job.id,
        status: "applied"
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Application Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    if (score >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const timeAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Card className="job-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                {job.location && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                )}
                {formatSalary(job.salaryMin, job.salaryMax) && (
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeAgo(job.postedAt || job.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {job.matchScore && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <Badge className={getMatchScoreBadge(job.matchScore)}>
                  {job.matchScore}% Match
                </Badge>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveJobMutation.mutate()}
                disabled={saveJobMutation.isPending}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
              {job.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
              <Button 
                className="btn-gradient"
                size="sm"
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? (
                  "Applying..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Apply Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.skills?.slice(0, 4).map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills?.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
          
          {/* Job type and experience level badges */}
          {job.jobType && (
            <Badge variant="outline" className="text-xs">
              {job.jobType}
            </Badge>
          )}
          {job.experienceLevel && (
            <Badge variant="outline" className="text-xs">
              {job.experienceLevel}
            </Badge>
          )}
          {job.source && (
            <Badge variant="outline" className="text-xs">
              via {job.source}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
