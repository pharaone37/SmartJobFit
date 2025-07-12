import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  ExternalLink, 
  Bookmark,
  BookmarkCheck,
  Star
} from "lucide-react";
import { Job } from "@/lib/types";
import { useState } from "react";
import { useApplyToJob } from "@/hooks/useJobs";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  showMatchScore?: boolean;
  onBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
}

export function JobCard({ 
  job, 
  showApplyButton = true, 
  showMatchScore = true,
  onBookmark,
  isBookmarked = false 
}: JobCardProps) {
  const [isBookmarkedState, setIsBookmarked] = useState(isBookmarked);
  const applyToJob = useApplyToJob();

  const handleApply = async () => {
    try {
      await applyToJob.mutateAsync({ jobId: job.id });
    } catch (error) {
      console.error('Failed to apply to job:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarkedState);
    onBookmark?.(job.id);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return null;
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {job.company.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {job.title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {job.company} • {job.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showMatchScore && job.matchScore && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <Badge className={getMatchScoreColor(job.matchScore)}>
                  {job.matchScore}% Match
                </Badge>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmark}
            >
              {isBookmarkedState ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {formatSalary(job.salaryMin, job.salaryMax) && (
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
          )}
          {job.postedAt && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>15+ applicants</span>
          </div>
        </div>

        {/* Job Description */}
        {job.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {job.description}
          </p>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {job.jobType || 'Full-time'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {job.experienceLevel || 'Mid-level'}
            </Badge>
            {job.location?.toLowerCase().includes('remote') && (
              <Badge className="text-xs bg-green-100 text-green-800">
                Remote
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {job.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </a>
              </Button>
            )}
            {showApplyButton && (
              <Button 
                size="sm" 
                className="button-gradient"
                onClick={handleApply}
                disabled={applyToJob.isPending}
              >
                {applyToJob.isPending ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
