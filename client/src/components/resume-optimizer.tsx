import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  Zap, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Upload,
  Download,
  Sparkles
} from "lucide-react";

export default function ResumeOptimizer() {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { resumeId?: number; jobDescription?: string }) => {
      const response = await apiRequest("POST", "/api/resumes/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${data.atsScore}% for ATS compatibility.`,
      });
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const optimizeMutation = useMutation({
    mutationFn: async (data: { resumeId?: number; jobDescription?: string }) => {
      const response = await apiRequest("POST", "/api/resumes/optimize", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Resume Optimized",
        description: "Your resume has been optimized for better ATS compatibility.",
      });
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    analyzeMutation.mutate({ jobDescription });
  };

  const handleOptimize = () => {
    optimizeMutation.mutate({ jobDescription });
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getATSScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Upload/Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Resume Optimizer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Description Input */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get targeted optimization suggestions..."
              rows={6}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adding a job description helps our AI provide more targeted optimization suggestions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || analyzeMutation.isPending}
              className="btn-gradient"
            >
              <Target className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
            <Button 
              variant="outline"
              onClick={handleOptimize}
              disabled={optimizeMutation.isPending}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {optimizeMutation.isPending ? "Optimizing..." : "AI Optimize"}
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Tabs defaultValue="score" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="score">ATS Score</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>ATS Compatibility Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getATSScoreColor(analysisResult.atsScore || 0)} mb-2`}>
                      {analysisResult.atsScore || 0}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {getATSScoreLabel(analysisResult.atsScore || 0)}
                    </p>
                  </div>
                  <Progress value={analysisResult.atsScore || 0} className="h-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Your resume is {analysisResult.atsScore >= 70 ? "well" : "poorly"} optimized for Applicant Tracking Systems
                  </p>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Format & Structure</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-semibold text-green-600">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Keyword Match</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm font-semibold text-blue-600">72%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Quality</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={91} className="w-20 h-2" />
                        <span className="text-sm font-semibold text-green-600">91%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Readability</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={88} className="w-20 h-2" />
                        <span className="text-sm font-semibold text-green-600">88%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid gap-4">
              {/* Strengths */}
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Excellent use of quantified achievements and metrics
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Clean, ATS-friendly formatting with proper sections
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Strong action verbs and professional language
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card className="border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Add Missing Keywords
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Include "machine learning", "data analysis", and "Python" to increase match rate by 15%
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Strengthen Impact Statements
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Replace "Managed team" with "Led cross-functional team of 8 engineers, resulting in 40% faster delivery"
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Add Technical Skills Section
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Create a dedicated skills section to improve ATS keyword matching
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Found Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span>Matched Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords?.slice(0, 10).map((keyword: string, index: number) => (
                      <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    These keywords from the job description were found in your resume.
                  </p>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Missing Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Machine Learning", "Python", "Data Analysis", "Agile", "Leadership", "Cloud Computing"].map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Consider adding these keywords naturally throughout your resume.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="w-8 h-8 text-purple-600" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span>Create New Version</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span>Track Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
