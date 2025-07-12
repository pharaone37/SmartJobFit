import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MoreHorizontal, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { JobApplication } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useUpdateApplicationStatus } from "@/hooks/useJobs";

interface ApplicationListProps {
  applications: JobApplication[];
  showAll?: boolean;
  maxItems?: number;
}

export function ApplicationList({ applications, showAll = false, maxItems = 5 }: ApplicationListProps) {
  const updateStatus = useUpdateApplicationStatus();
  
  const displayedApplications = showAll ? applications : applications.slice(0, maxItems);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'offer':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'interview':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: applicationId, status: newStatus });
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No applications yet</p>
            <p className="text-gray-400 text-xs mt-1">Start applying to jobs to see your progress here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={showAll ? "h-96" : "h-auto"}>
          <div className="space-y-4">
            {displayedApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {application.job?.company.charAt(0) || 'J'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{application.job?.title}</h4>
                      {application.matchScore && (
                        <Badge variant="outline" className="text-xs">
                          {application.matchScore}% Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {application.job?.company} • {application.job?.location}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>
                        Applied {formatDistanceToNow(new Date(application.appliedAt || ''), { addSuffix: true })}
                      </span>
                      {application.job?.salaryMin && application.job?.salaryMax && (
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            ${(application.job.salaryMin / 1000).toFixed(0)}k - ${(application.job.salaryMax / 1000).toFixed(0)}k
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, 'interview')}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Mark as Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, 'offer')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Offer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Rejected
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {application.job?.url && (
                        <DropdownMenuItem asChild>
                          <a href={application.job.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Job
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {!showAll && applications.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Applications ({applications.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
