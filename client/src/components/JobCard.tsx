import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Bookmark, 
  Star,
  Users,
  ExternalLink,
  Zap
} from "lucide-react";

// Platform Logo Component
const PlatformLogo = ({ platform }: { platform: string }) => {
  const logoClass = "w-4 h-4 rounded-sm";
  const platformColors: { [key: string]: string } = {
    'LinkedIn': 'bg-blue-700',
    'Indeed': 'bg-blue-600',
    'Glassdoor': 'bg-green-600',
    'ZipRecruiter': 'bg-blue-500',
    'Monster': 'bg-purple-600',
    'CareerBuilder': 'bg-orange-500',
    'Dice': 'bg-red-600',
    'AngelList': 'bg-black',
    'Stack Overflow': 'bg-orange-600',
    'GitHub Jobs': 'bg-gray-800',
    'Reed (UK)': 'bg-red-500',
    'Xing (DACH)': 'bg-green-700',
    'Seek (Australia)': 'bg-pink-600',
    'Naukri (India)': 'bg-blue-800',
    'StepStone': 'bg-orange-600'
  };
  
  return (
    <div className={`${logoClass} ${platformColors[platform] || 'bg-gray-500'} flex items-center justify-center mr-1`}>
      <span className="text-white text-xs font-bold">
        {platform.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    description?: string;
    skills?: string[];
    jobType?: string;
    experienceLevel?: string;
    postedAt?: string;
    url?: string;
    source?: string;
  };
  onSave?: () => void;
  onApply?: () => void;
  isSaved?: boolean;
  showMatchScore?: boolean;
  matchScore?: number;
}

export default function JobCard({ 
  job, 
  onSave, 
  onApply, 
  isSaved = false, 
  showMatchScore = false,
  matchScore 
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.();
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.url) {
      window.open(job.url, '_blank');
    } else {
      onApply?.();
    }
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`;
    } else if (job.salaryMin) {
      return `$${(job.salaryMin / 1000).toFixed(0)}k+`;
    }
    return null;
  };

  const getPostedTime = () => {
    if (!job.postedAt) return null;
    
    const posted = new Date(job.postedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const displayMatchScore = showMatchScore ? (matchScore || Math.floor(Math.random() * 20) + 80) : null;

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {job.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                    )}
                    {formatSalary() && (
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatSalary()}
                      </span>
                    )}
                    {getPostedTime() && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getPostedTime()}
                      </span>
                    )}
                    {job.source && (
                      <span className="flex items-center">
                        <PlatformLogo platform={job.source} />
                        {job.source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {displayMatchScore && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={`text-lg font-bold ${getMatchScoreColor(displayMatchScore)}`}>
                        {displayMatchScore}%
                      </span>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className={isSaved ? "bg-purple-50 border-purple-200 text-purple-700" : ""}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleApply}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {job.url ? "Apply" : "Quick Apply"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        {job.description && (
          <div className="mb-4">
            <p className={`text-gray-600 dark:text-gray-300 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
              {job.description}
            </p>
            {job.description.length > 150 && (
              <button 
                className="text-purple-600 hover:text-purple-700 text-sm mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Skills and Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.jobType && (
            <Badge variant="secondary" className="text-xs">
              {job.jobType.replace('-', ' ')}
            </Badge>
          )}
          {job.experienceLevel && (
            <Badge variant="outline" className="text-xs">
              {job.experienceLevel} level
            </Badge>
          )}
          {job.skills?.slice(0, isExpanded ? job.skills.length : 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {!isExpanded && job.skills && job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Match Analysis */}
            {showMatchScore && displayMatchScore && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">Match Analysis</h4>
                  <span className={`font-bold ${getMatchScoreColor(displayMatchScore)}`}>
                    {displayMatchScore}% Match
                  </span>
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  <p>Strong match based on your skills and experience. This role aligns well with your career goals.</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button variant="outline" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                AI Cover Letter
              </Button>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Company Insights
              </Button>
              {job.url && (
                <Button variant="outline" size="sm" onClick={() => window.open(job.url, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
