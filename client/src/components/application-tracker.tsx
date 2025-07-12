import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

export default function ApplicationTracker() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/applications"],
    staleTime: 2 * 60 * 1000,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "interview":
        return <Calendar className="w-4 h-4 text-green-600" />;
      case "offer":
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "status-applied";
      case "interview":
        return "status-interview";
      case "offer":
        return "status-offer";
      case "rejected":
        return "status-rejected";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "applied":
        return 25;
      case "interview":
        return 50;
      case "offer":
        return 100;
      case "rejected":
        return 0;
      default:
        return 0;
    }
  };

  const statusCounts = applications?.reduce((acc: any, app: any) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const recentApplications = applications?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Application Tracker</CardTitle>
        <Link href="/applications">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.applied || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.interview || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.offer || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Offers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No applications yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                Start applying to jobs to track your progress
              </p>
              <Link href="/job-search">
                <Button className="btn-gradient">
                  Find Jobs
                </Button>
              </Link>
            </div>
          ) : (
            recentApplications.map((application: any) => (
              <div key={application.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {application.job?.title || "Job Title"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {application.job?.company || "Company"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={getStatusProgress(application.status)} className="h-2" />
                  </div>
                  {application.matchScore && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Match Score: <span className="font-semibold text-purple-600">{application.matchScore}%</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {applications && applications.length > 5 && (
          <div className="text-center pt-4">
            <Link href="/applications">
              <Button variant="outline">
                View All {applications.length} Applications
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
