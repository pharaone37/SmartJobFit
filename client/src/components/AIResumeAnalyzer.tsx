import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Target,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  skillsAnalysis: {
    technical: string[];
    soft: string[];
  };
  experienceLevel: string;
  industryFit: string;
}

interface ResumeOptimization {
  optimizedResume: string;
  changes: string[];
  keywordImprovements: string[];
  structureImprovements: string[];
  contentImprovements: string[];
  atsImprovements: string[];
}

export default function AIResumeAnalyzer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [activeTab, setActiveTab] = useState("analyze");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [optimization, setOptimization] = useState<ResumeOptimization | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { resumeContent: string; jobDescription?: string }) => {
      return await apiRequest('/api/resume/analyze', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Resume Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    }
  });

  const optimizeMutation = useMutation({
    mutationFn: async (data: { resumeContent: string; jobDescription: string; targetRole: string }) => {
      return await apiRequest('/api/resume/optimize', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setOptimization(data);
      toast({
        title: "Resume Optimization Complete",
        description: "Your resume has been optimized successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = () => {
    if (!resumeContent) {
      toast({
        title: "Resume Required",
        description: "Please enter your resume content to analyze.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate({ resumeContent, jobDescription });
  };

  const handleOptimize = () => {
    if (!resumeContent || !jobDescription || !targetRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to optimize your resume.",
        variant: "destructive",
      });
      return;
    }
    optimizeMutation.mutate({ resumeContent, jobDescription, targetRole });
  };

  const ScoreCard = ({ title, score, color }: { title: string; score: number; color: string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Progress value={score} className="flex-1" />
          <span className={`text-sm font-bold ${color}`}>{score}/100</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Resume Analyzer</h1>
        <p className="text-gray-600">Get AI-powered insights and optimization for your resume</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze">Analyze Resume</TabsTrigger>
          <TabsTrigger value="optimize">Optimize Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Analysis
              </CardTitle>
              <CardDescription>
                Paste your resume content below for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume Content *</label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description (Optional)</label>
                <Textarea
                  placeholder="Paste the job description to get targeted analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending || !resumeContent}
                className="w-full"
              >
                {analyzeMutation.isPending ? "Analyzing..." : "Analyze Resume"}
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScoreCard 
                  title="Overall Score" 
                  score={analysis.overallScore} 
                  color="text-blue-600" 
                />
                <ScoreCard 
                  title="ATS Compatibility" 
                  score={analysis.atsScore} 
                  color="text-green-600" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Keyword Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordMatches.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsAnalysis.technical.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsAnalysis.soft.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Experience Level:</strong> {analysis.experienceLevel} | 
                  <strong> Industry Fit:</strong> {analysis.industryFit}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Resume Optimization
              </CardTitle>
              <CardDescription>
                Optimize your resume for specific job descriptions and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume Content *</label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role *</label>
                <Textarea
                  placeholder="e.g., Senior Software Engineer, Data Scientist, Product Manager..."
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="min-h-16"
                />
              </div>

              <Button 
                onClick={handleOptimize}
                disabled={optimizeMutation.isPending || !resumeContent || !jobDescription || !targetRole}
                className="w-full"
              >
                {optimizeMutation.isPending ? "Optimizing..." : "Optimize Resume"}
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {optimization && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{optimization.optimizedResume}</pre>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Changes Made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimization.changes.map((change, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimization.keywordImprovements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Structure Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimization.structureImprovements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ATS Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {optimization.atsImprovements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}