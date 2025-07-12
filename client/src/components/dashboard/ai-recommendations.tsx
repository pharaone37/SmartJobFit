import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  FileText, 
  Video, 
  DollarSign, 
  TrendingUp,
  ArrowRight,
  Star,
  Target
} from "lucide-react";
import { Link } from "wouter";

interface Recommendation {
  id: string;
  type: 'resume' | 'interview' | 'salary' | 'job' | 'skill';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl: string;
  actionText: string;
  icon: React.ReactNode;
}

interface AIRecommendationsProps {
  recommendations?: Recommendation[];
  showAll?: boolean;
  maxItems?: number;
}

export function AIRecommendations({ recommendations, showAll = false, maxItems = 4 }: AIRecommendationsProps) {
  // Mock recommendations - in real app, this would come from props or API
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'resume',
      title: 'Optimize Your Resume',
      description: 'Add "React" and "Node.js" to increase match rate by 15%',
      impact: '+15% match rate',
      priority: 'high',
      actionUrl: '/resume',
      actionText: 'Apply Suggestion',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview Prep',
      description: 'Practice common PM questions for TechCorp interview',
      impact: '+30% confidence',
      priority: 'high',
      actionUrl: '/interview',
      actionText: 'Start Practice',
      icon: <Video className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'salary',
      title: 'Salary Negotiation',
      description: 'Market data shows you can negotiate 20% higher',
      impact: '+20% salary potential',
      priority: 'medium',
      actionUrl: '/analytics',
      actionText: 'View Analysis',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'job',
      title: 'New Job Matches',
      description: '5 new high-match jobs in your area',
      impact: '94% average match',
      priority: 'medium',
      actionUrl: '/jobs',
      actionText: 'View Jobs',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'skill',
      title: 'Skill Development',
      description: 'Learning TypeScript could increase your matches by 25%',
      impact: '+25% job matches',
      priority: 'low',
      actionUrl: '/analytics',
      actionText: 'Learn More',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  const displayedRecommendations = showAll 
    ? (recommendations || mockRecommendations)
    : (recommendations || mockRecommendations).slice(0, maxItems);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'resume':
        return 'card-gradient';
      case 'interview':
        return 'card-gradient-blue';
      case 'salary':
        return 'card-gradient-green';
      case 'job':
        return 'card-gradient';
      case 'skill':
        return 'card-gradient-blue';
      default:
        return 'card-gradient';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className={showAll ? "h-96" : "h-auto"}>
          <div className="space-y-4">
            {displayedRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getCardGradient(recommendation.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                      {recommendation.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(recommendation.priority)} variant="outline">
                          {recommendation.priority}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-green-600 font-medium">
                            {recommendation.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {recommendation.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group"
                  asChild
                >
                  <Link href={recommendation.actionUrl}>
                    {recommendation.actionText}
                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        {!showAll && (recommendations || mockRecommendations).length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Recommendations ({(recommendations || mockRecommendations).length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
