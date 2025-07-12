import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import { 
  FileText, 
  Upload, 
  Download, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Edit,
  Trash2,
  Star,
  Target,
  TrendingUp,
  Eye,
  BarChart3
} from "lucide-react";

export default function ResumeOptimization() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("resumes");
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Sample resume data (fallback)
  const sampleResumes = [
    { id: 1, title: 'Senior Software Engineer Resume', score: 85, lastUpdated: '2 days ago', isActive: true },
    { id: 2, title: 'Product Manager Resume', score: 78, lastUpdated: '1 week ago', isActive: false },
    { id: 3, title: 'Full Stack Developer Resume', score: 92, lastUpdated: '3 days ago', isActive: false },
  ];

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch resumes
  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ["/api/resumes"],
    retry: false,
    enabled: isAuthenticated,
    meta: {
      onError: (error: Error) => {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 500);
          return;
        }
      }
    }
  });

  // Use sample data if API fails
  const resumes = resumesData || sampleResumes;

  // Create resume mutation
  const createResumeMutation = useMutation({
    mutationFn: async (resumeData: any) => {
      return await apiRequest("POST", "/api/resumes", resumeData);
    },
    onSuccess: () => {
      toast({
        title: "Resume Created",
        description: "Your resume has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setNewResumeTitle("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Creation Failed",
        description: "Could not create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Analyze resume mutation
  const analyzeResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest("POST", `/api/resumes/${resumeId}/analyze`, {});
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setSelectedResume((prev: any) => ({ ...prev, analysis: data }));
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Analysis Failed",
        description: "Could not analyze resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Optimize resume mutation
  const optimizeResumeMutation = useMutation({
    mutationFn: async ({ resumeId, jobDescription }: { resumeId: string; jobDescription: string }) => {
      return await apiRequest("POST", `/api/resumes/${resumeId}/optimize`, { jobDescription });
    },
    onSuccess: (data) => {
      toast({
        title: "Optimization Complete",
        description: "Your resume has been optimized for the job!",
      });
      setSelectedResume((prev: any) => ({ ...prev, optimization: data }));
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Optimization Failed",
        description: "Could not optimize resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleCreateResume = () => {
    if (!newResumeTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your resume.",
        variant: "destructive",
      });
      return;
    }

    createResumeMutation.mutate({
      title: newResumeTitle,
      content: {
        personalInfo: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
          title: user?.title || "",
        },
        experience: [],
        education: [],
        skills: user?.skills || [],
        summary: user?.summary || "",
      }
    });
  };

  const handleAnalyzeResume = (resumeId: string) => {
    analyzeResumeMutation.mutate(resumeId);
  };

  const handleOptimizeResume = () => {
    if (!selectedResume || !jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to optimize against.",
        variant: "destructive",
      });
      return;
    }

    optimizeResumeMutation.mutate({
      resumeId: selectedResume.id,
      jobDescription: jobDescription,
    });
  };

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

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your resume with AI to pass ATS systems and land more interviews
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="analyze">AI Analysis</TabsTrigger>
            <TabsTrigger value="optimize">Optimization</TabsTrigger>
          </TabsList>

          {/* My Resumes Tab */}
          <TabsContent value="resumes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Your Resumes</h2>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>

                {resumesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                            </div>
                          </div>
                          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : resumes && resumes.length > 0 ? (
                  <div className="space-y-4">
                    {resumes.map((resume: any) => (
                      <Card key={resume.id} className={`p-6 cursor-pointer transition-colors ${selectedResume?.id === resume.id ? 'ring-2 ring-purple-500' : ''}`} onClick={() => setSelectedResume(resume)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{resume.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                              </p>
                              {resume.atsScore && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-muted-foreground">ATS Score:</span>
                                  <Badge variant={getScoreVariant(resume.atsScore)} className="text-xs">
                                    {resume.atsScore}%
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {resume.isActive && (
                              <Badge variant="default">Active</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first resume to get started with AI optimization
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Resume
                    </Button>
                  </Card>
                )}
              </div>

              {/* Quick Create */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Quick Create
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Resume Title</label>
                      <Input
                        placeholder="e.g., Software Engineer Resume"
                        value={newResumeTitle}
                        onChange={(e) => setNewResumeTitle(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateResume}
                      disabled={createResumeMutation.isPending}
                      className="w-full"
                    >
                      Create Resume
                    </Button>
                    <Separator />
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Existing
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="analyze" className="mt-6">
            {selectedResume ? (
              <ResumeAnalyzer 
                resume={selectedResume}
                onAnalyze={() => handleAnalyzeResume(selectedResume.id)}
                isAnalyzing={analyzeResumeMutation.isPending}
              />
            ) : (
              <Card className="p-12 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a resume to analyze</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a resume from the "My Resumes" tab to get AI-powered analysis
                </p>
                <Button onClick={() => setActiveTab("resumes")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Select Resume
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="mt-6">
            {selectedResume ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Job-Specific Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Job Description
                        </label>
                        <Textarea
                          placeholder="Paste the job description you want to optimize for..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={8}
                        />
                      </div>
                      <Button 
                        onClick={handleOptimizeResume}
                        disabled={optimizeResumeMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize Resume
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedResume.optimization ? (
                        <div className="space-y-6">
                          {/* ATS Score */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">ATS Compatibility Score</span>
                              <span className={`text-sm font-bold ${getScoreColor(selectedResume.optimization.atsScore || 0)}`}>
                                {selectedResume.optimization.atsScore || 0}%
                              </span>
                            </div>
                            <Progress value={selectedResume.optimization.atsScore || 0} className="h-2" />
                          </div>

                          {/* Suggestions */}
                          {selectedResume.optimization.suggestions && (
                            <div>
                              <h4 className="font-semibold mb-3">AI Suggestions</h4>
                              <div className="space-y-3">
                                {selectedResume.optimization.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                    <p className="text-sm">{suggestion}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Keywords */}
                          {selectedResume.optimization.keywords && (
                            <div>
                              <h4 className="font-semibold mb-3">Recommended Keywords</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedResume.optimization.keywords.slice(0, 8).map((keyword: string, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Optimized Resume
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Enter a job description and click "Optimize Resume" to get AI-powered suggestions
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a resume to optimize</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a resume from the "My Resumes" tab to optimize it for specific jobs
                </p>
                <Button onClick={() => setActiveTab("resumes")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Select Resume
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
