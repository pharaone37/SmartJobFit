import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  Target,
  Lightbulb,
  Download,
  Zap,
  TrendingUp,
  Eye,
  Award
} from "lucide-react";

interface ResumeAnalyzerProps {
  resume: {
    id: string;
    title: string;
    atsScore?: number;
    analysis?: {
      atsScore: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      keywords: string[];
      improvements: {
        format: string[];
        content: string[];
        keywords: string[];
      };
    };
  };
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function ResumeAnalyzer({ resume, onAnalyze, isAnalyzing }: ResumeAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const analysisData = resume.analysis || {
    atsScore: 0,
    strengths: [],
    weaknesses: [],
    recommendations: [],
    keywords: [],
    improvements: {
      format: [],
      content: [],
      keywords: []
    }
  };

  const mockAnalysis = {
    readability: 85,
    formatting: 78,
    keywords: 65,
    content: 88,
    overall: analysisData.atsScore || 75
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>{resume.title}</CardTitle>
                <p className="text-muted-foreground">AI-Powered Resume Analysis</p>
              </div>
            </div>
            <Button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <>
                  <BarChart3 className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Results */}
      {analysisData.atsScore > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-500" />
                    Overall ATS Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold ${getScoreColor(analysisData.atsScore)} mb-2`}>
                      {analysisData.atsScore}%
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      {getScoreIcon(analysisData.atsScore)}
                      <span className="text-muted-foreground">
                        {analysisData.atsScore >= 80 ? "Excellent" : 
                         analysisData.atsScore >= 60 ? "Good" : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                  <Progress value={analysisData.atsScore} className="h-3 mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    Your resume is {analysisData.atsScore >= 80 ? "well-optimized" : "partially optimized"} for ATS systems
                  </p>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockAnalysis).map(([category, score], index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{category}</span>
                          <span className={getScoreColor(score)}>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    {analysisData.strengths.length} Strengths
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your resume has strong fundamentals
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950/20 dark:to-orange-950/20">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    {analysisData.recommendations.length} Recommendations
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Areas for improvement identified
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {analysisData.keywords.length} Keywords
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Optimize for better matching
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strengths Tab */}
          <TabsContent value="strengths" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Resume Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.strengths.length > 0 ? (
                  <div className="space-y-4">
                    {analysisData.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-green-800 dark:text-green-200">{strength}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Run analysis to see your resume strengths</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improvements Tab */}
          <TabsContent value="improvements" className="mt-6">
            <div className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisData.recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {analysisData.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-yellow-800 dark:text-yellow-200">{recommendation}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Run analysis to get personalized recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Improvement Categories */}
              {analysisData.improvements && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Format Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisData.improvements.format.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <AlertTriangle className="w-3 h-3 text-yellow-500 mr-2 mt-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisData.improvements.content.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <AlertTriangle className="w-3 h-3 text-yellow-500 mr-2 mt-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Keyword Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisData.improvements.keywords.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <AlertTriangle className="w-3 h-3 text-yellow-500 mr-2 mt-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Keyword Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.keywords.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Recommended Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-purple-100">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Keyword Optimization Tips
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Include keywords naturally in your experience descriptions</li>
                        <li>• Use both full terms and acronyms (e.g., "Artificial Intelligence" and "AI")</li>
                        <li>• Match keywords exactly as they appear in job descriptions</li>
                        <li>• Don't overuse keywords - maintain readability</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Run analysis to see keyword recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* No Analysis State */}
      {analysisData.atsScore === 0 && !isAnalyzing && (
        <Card className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-4">Ready for AI Analysis</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get detailed insights about your resume's ATS compatibility, strengths, and areas for improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onAnalyze}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              Analyze Resume
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Sample
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
