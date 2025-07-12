import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ResumeOptimizer from "@/components/resume-optimizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Plus, 
  Edit, 
  Download, 
  Upload, 
  Zap, 
  Target,
  CheckCircle,
  AlertTriangle,
  Star,
  Sparkles
} from "lucide-react";

export default function ResumeBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: resumes, isLoading } = useQuery({
    queryKey: ["/api/resumes"],
    staleTime: 5 * 60 * 1000,
  });

  const createResumeMutation = useMutation({
    mutationFn: async (resumeData: any) => {
      const response = await apiRequest("POST", "/api/resumes", resumeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Created",
        description: "Your resume has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeResumeMutation = useMutation({
    mutationFn: async (resumeId: number) => {
      const response = await apiRequest("POST", `/api/resumes/${resumeId}/analyze`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${data.atsScore}% for ATS compatibility.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const optimizeResumeMutation = useMutation({
    mutationFn: async ({ resumeId, jobDescription }: { resumeId: number; jobDescription?: string }) => {
      const response = await apiRequest("POST", `/api/resumes/${resumeId}/optimize`, { jobDescription });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Optimized",
        description: "Your resume has been optimized for better ATS compatibility.",
      });
      setIsOptimizing(false);
    },
    onError: (error) => {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize resume. Please try again.",
        variant: "destructive",
      });
      setIsOptimizing(false);
    },
  });

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getATSScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    if (score >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
  };

  const handleOptimizeResume = (resumeId: number) => {
    setSelectedResumeId(resumeId);
    setIsOptimizing(true);
    optimizeResumeMutation.mutate({ resumeId });
  };

  const handleAnalyzeResume = (resumeId: number) => {
    analyzeResumeMutation.mutate(resumeId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-72">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Create and optimize your resume with AI
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Resume</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Resume Title</Label>
                        <Input id="title" placeholder="e.g., Software Engineer Resume" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template">Template</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="h-20">
                            <div className="text-center">
                              <FileText className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Modern</span>
                            </div>
                          </Button>
                          <Button variant="outline" className="h-20">
                            <div className="text-center">
                              <FileText className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Classic</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="btn-gradient">Create Resume</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs defaultValue="resumes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resumes">My Resumes</TabsTrigger>
                <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="resumes" className="space-y-6">
                {/* Resume List */}
                <div className="grid gap-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      {resumes && resumes.length > 0 ? (
                        <div className="grid gap-4">
                          {resumes.map((resume: any) => (
                            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {resume.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        {resume.isDefault && (
                                          <Badge variant="secondary">Default</Badge>
                                        )}
                                        {resume.atsScore && (
                                          <Badge className={getATSScoreBadge(resume.atsScore)}>
                                            ATS Score: {resume.atsScore}%
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleAnalyzeResume(resume.id)}
                                      disabled={analyzeResumeMutation.isPending}
                                    >
                                      <Target className="w-4 h-4 mr-2" />
                                      Analyze
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOptimizeResume(resume.id)}
                                      disabled={optimizeResumeMutation.isPending}
                                    >
                                      <Zap className="w-4 h-4 mr-2" />
                                      Optimize
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Resume Content Preview */}
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700 dark:text-gray-300">Skills</p>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {resume.keywords?.slice(0, 3).join(", ")}
                                        {resume.keywords?.length > 3 && "..."}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700 dark:text-gray-300">Version</p>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {resume.version || "1.0"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <div className="text-gray-400 mb-4">
                              <FileText className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-lg font-semibold">No resumes yet</p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Create your first resume to get started
                            </p>
                            <Button className="btn-gradient">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Resume
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="optimizer" className="space-y-6">
                <ResumeOptimizer />
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Template {i + 1}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Professional template perfect for {["software engineers", "product managers", "designers", "data scientists", "consultants", "marketers"][i]}
                        </p>
                        <Button className="w-full btn-gradient">
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
