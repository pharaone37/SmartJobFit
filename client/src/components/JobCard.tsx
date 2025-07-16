import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building, Bookmark, ExternalLink, TrendingUp } from "lucide-react";
import { Job } from "@shared/schema";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  isBookmarked?: boolean;
  showMatchScore?: boolean;
  compact?: boolean;
}

export function JobCard({ 
  job, 
  onBookmark, 
  onApply, 
  isBookmarked = false,
  showMatchScore = false,
  compact = false
}: JobCardProps) {
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async () => {
    if (!onBookmark) return;
    setBookmarkLoading(true);
    try {
      await onBookmark(job.id);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const formatSalary = (salary: string | null) => {
    if (!salary) return null;
    return salary.replace(/\$(\d+)k/g, '$$$1,000');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (score >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 ${compact ? 'p-3' : ''}`}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                {job.title}
              </CardTitle>
              {showMatchScore && job.matchScore && (
                <Badge variant="secondary" className={`${getMatchScoreColor(job.matchScore)} text-xs`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {job.matchScore}% match
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
              </div>
              
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              )}
              
              {job.workType && (
                <Badge variant="outline" className="text-xs">
                  {job.workType}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`${isBookmarked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} hover:text-blue-600 dark:hover:text-blue-400`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={compact ? "pt-0" : ""}>
        <div className="space-y-3">
          {/* Job details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{formatSalary(job.salary)}</span>
              </div>
            )}
            
            {job.postedDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {job.experienceLevel && (
              <Badge variant="secondary" className="text-xs">
                {job.experienceLevel}
              </Badge>
            )}
          </div>

          {/* Job description excerpt */}
          {job.description && !compact && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {job.description.substring(0, 150)}...
            </p>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, compact ? 3 : 5).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > (compact ? 3 : 5) && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{job.skills.length - (compact ? 3 : 5)} more
                </Badge>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button 
              onClick={() => onApply?.(job.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Apply Now
            </Button>
            
            {job.url && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(job.url, '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                {compact ? '' : 'View'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}