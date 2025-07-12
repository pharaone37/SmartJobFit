import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { 
  Sparkles, 
  Target, 
  FileText, 
  Video, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  X,
  RefreshCw,
  ArrowRight
} from "lucide-react";

export default function AiRecommendations() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/recommendations"],
    staleTime: 10 * 60 * 1000,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/recommendations/generate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Recommendations Generated",
        description: "New AI recommendations have been generated for you.",
      });
      setIsGenerating(false);
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/recommendations/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  const markAsImplementedMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/recommendations/${id}/implement`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Great Job!",
        description: "Recommendation marked as implemented.",
      });
    },
  });

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "resume":
        return FileText;
      case "interview":
        return Video;
      case "salary":
        return DollarSign;
      case "strategy":
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "resume":
        return "from-blue-500 to-indigo-500";
      case "interview":
        return "from-green-500 to-teal-500";
      case "salary":
        return "from-yellow-500 to-orange-500";
      case "strategy":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    generateRecommendationsMutation.mutate();
  };

  const handleMarkAsImplemented = (id: number) => {
    markAsImplementedMutation.mutate(id);
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const unreadRecommendations = recommendations?.filter((rec: any) => !rec.isRead) || [];
  const implementedRecommendations = recommendations?.filter((rec: any) => rec.isImplemented) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                  </div>
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
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>AI Recommendations</span>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateRecommendations}
          disabled={isGenerating}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "Generating..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {unreadRecommendations.length === 0 && !isGenerating ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No new recommendations</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Generate personalized recommendations to improve your job search
            </p>
            <Button onClick={handleGenerateRecommendations} className="btn-gradient">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {unreadRecommendations.slice(0, 3).map((recommendation: any) => {
              const Icon = getRecommendationIcon(recommendation.type);
              return (
                <div key={recommendation.id} className="p-4 card-gradient rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getRecommendationColor(recommendation.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 truncate">
                          {recommendation.title}
                        </h4>
                        <Badge className={getPriorityBadge(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 line-clamp-2">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsImplemented(recommendation.id)}
                          disabled={markAsImplementedMutation.isPending}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(recommendation.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {unreadRecommendations.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  View {unreadRecommendations.length - 3} More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Implemented Recommendations Summary */}
            {implementedRecommendations.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                    {implementedRecommendations.length} recommendations completed
                  </p>
                  <Button variant="ghost" size="sm">
                    View History
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
