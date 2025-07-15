import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Download, 
  Star, 
  Target, 
  Lightbulb,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ParsedResume {
  id: string;
  fileName: string;
  sections: ResumeSection[];
  overallAtsScore: number;
  createdAt: string;
  lastModified: string;
  version: string;
}

interface ResumeSection {
  id: string;
  type: string;
  title: string;
  content: any;
  optimizationSuggestions: string[];
  atsScore: number;
  keywords: string[];
}

interface ATSAnalysis {
  overallScore: number;
  systemCompatibility: {
    system: string;
    score: number;
    issues: string[];
    recommendations: string[];
  }[];
  keywordAnalysis: {
    keyword: string;
    frequency: number;
    relevanceScore: number;
    suggestions: string[];
  }[];
  formatIssues: string[];
  contentSuggestions: string[];
}

interface OptimizationSuggestion {
  section: string;
  type: 'keyword' | 'content' | 'format' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
  before: string;
  after: string;
}

export function ResumeOptimizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentResume, setCurrentResume] = useState<ParsedResume | null>(null);
  const [atsAnalysis, setATSAnalysis] = useState<ATSAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Upload resume mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setCurrentResume(data.resume);
        setActiveTab('analysis');
        toast({
          title: "Resume Uploaded",
          description: "Your resume has been successfully parsed and analyzed",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get ATS analysis
  const atsAnalysisMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest(`/api/resume/ats-score/${resumeId}`, {
        method: 'GET',
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setATSAnalysis(data.atsAnalysis);
      }
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze ATS compatibility",
        variant: "destructive",
      });
    },
  });

  // Optimize resume mutation
  const optimizeMutation = useMutation({
    mutationFn: async (optimizationData: {
      resumeId: string;
      targetRole?: string;
      targetCompany?: string;
      jobDescription?: string;
      industry?: string;
      experienceLevel?: string;
    }) => {
      return await apiRequest('/api/resume/optimize', {
        method: 'POST',
        body: JSON.stringify(optimizationData),
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuggestions(data.suggestions);
        setActiveTab('suggestions');
        toast({
          title: "Optimization Complete",
          description: "AI-powered suggestions generated successfully",
        });
      }
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Failed to generate optimization suggestions",
        variant: "destructive",
      });
    },
  });

  // Generate PDF mutation
  const generatePDFMutation = useMutation({
    mutationFn: async (data: { resumeId: string; templateName?: string }) => {
      const response = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('PDF generation failed');
      }
      
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Generated",
        description: "Your optimized resume has been downloaded",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a resume file to upload",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(selectedFile);
  };

  // Handle ATS analysis
  const handleATSAnalysis = () => {
    if (!currentResume) return;
    atsAnalysisMutation.mutate(currentResume.id);
  };

  // Handle optimization
  const handleOptimize = () => {
    if (!currentResume) return;
    
    optimizeMutation.mutate({
      resumeId: currentResume.id,
      targetRole,
      targetCompany,
      jobDescription,
      experienceLevel: 'mid-level', // Default value
    });
  };

  // Handle PDF generation
  const handleGeneratePDF = () => {
    if (!currentResume) return;
    
    generatePDFMutation.mutate({
      resumeId: currentResume.id,
      templateName: 'professional',
    });
  };

  // Get ATS score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Resume Optimizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Achieve 99.8% ATS compatibility with AI-powered optimization
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!currentResume}>ATS Analysis</TabsTrigger>
              <TabsTrigger value="suggestions" disabled={!currentResume}>Optimization</TabsTrigger>
              <TabsTrigger value="download" disabled={!currentResume}>Download</TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your resume in PDF, DOC, or DOCX format for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {selectedFile ? selectedFile.name : 'Select your resume file'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Supported formats: PDF, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                        <div className="flex justify-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Choose File
                          </Button>
                          <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadMutation.isPending}
                          >
                            {uploadMutation.isPending ? 'Uploading...' : 'Upload & Analyze'}
                          </Button>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Resume Info */}
              {currentResume && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Current Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">File Name</p>
                        <p className="font-medium">{currentResume.fileName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ATS Score</p>
                        <p className={`font-medium ${getScoreColor(currentResume.overallAtsScore)}`}>
                          {currentResume.overallAtsScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Modified</p>
                        <p className="font-medium">
                          {new Date(currentResume.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      ATS Compatibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(currentResume?.overallAtsScore || 0)}`}>
                          {currentResume?.overallAtsScore || 0}%
                        </div>
                        <Progress 
                          value={currentResume?.overallAtsScore || 0} 
                          className="mt-2"
                        />
                      </div>
                      <Button
                        onClick={handleATSAnalysis}
                        disabled={atsAnalysisMutation.isPending}
                        className="w-full"
                      >
                        {atsAnalysisMutation.isPending ? 'Analyzing...' : 'Get Detailed Analysis'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Optimization Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Target Role</label>
                        <Input
                          placeholder="e.g., Senior Software Engineer"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Target Company</label>
                        <Input
                          placeholder="e.g., Google, Microsoft"
                          value={targetCompany}
                          onChange={(e) => setTargetCompany(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Job Description</label>
                        <Textarea
                          placeholder="Paste the job description here for targeted optimization..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={handleOptimize}
                        disabled={optimizeMutation.isPending}
                        className="w-full"
                      >
                        {optimizeMutation.isPending ? 'Optimizing...' : 'Generate Suggestions'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed ATS Analysis */}
              {atsAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed ATS Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* System Compatibility */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">System Compatibility</h3>
                        <div className="space-y-3">
                          {atsAnalysis.systemCompatibility.map((system, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{system.system}</h4>
                                <span className={`font-bold ${getScoreColor(system.score)}`}>
                                  {system.score}%
                                </span>
                              </div>
                              <Progress value={system.score} className="mb-2" />
                              {system.issues.length > 0 && (
                                <div className="text-sm text-red-600">
                                  <strong>Issues:</strong> {system.issues.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Keyword Analysis */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Keyword Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {atsAnalysis.keywordAnalysis.map((keyword, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{keyword.keyword}</span>
                                <span className="text-sm text-gray-500">
                                  {keyword.frequency}x
                                </span>
                              </div>
                              <Progress value={keyword.relevanceScore} className="mb-2" />
                              <p className="text-xs text-gray-600">
                                {keyword.suggestions[0]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Format Issues */}
                      {atsAnalysis.formatIssues.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Format Issues</h3>
                          <div className="space-y-2">
                            {atsAnalysis.formatIssues.map((issue, index) => (
                              <Alert key={index}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{issue}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI-Powered Optimization Suggestions
                  </CardTitle>
                  <CardDescription>
                    Implement these suggestions to improve your resume's ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={getPriorityColor(suggestion.priority)}
                                >
                                  {suggestion.priority.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary">{suggestion.type}</Badge>
                                <span className="text-sm text-gray-500">{suggestion.section}</span>
                              </div>
                              <p className="font-medium mb-1">{suggestion.suggestion}</p>
                              <p className="text-sm text-gray-600 mb-2">{suggestion.impact}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm font-medium text-red-600 mb-1">Before:</p>
                              <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded text-sm">
                                {suggestion.before}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-600 mb-1">After:</p>
                              <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded text-sm">
                                {suggestion.after}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {suggestions.length === 0 && (
                        <div className="text-center py-8">
                          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No suggestions yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Generate optimization suggestions in the Analysis tab
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Download Tab */}
            <TabsContent value="download" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Optimized Resume
                  </CardTitle>
                  <CardDescription>
                    Generate and download your ATS-optimized resume in PDF format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Template Options</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {['Professional', 'Modern', 'Creative', 'Minimal'].map((template) => (
                            <Card key={template} className="cursor-pointer hover:shadow-md">
                              <CardContent className="p-4 text-center">
                                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
                                <p className="text-sm font-medium">{template}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Resume Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">ATS Score</span>
                            <span className={`font-medium ${getScoreColor(currentResume?.overallAtsScore || 0)}`}>
                              {currentResume?.overallAtsScore || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Sections</span>
                            <span className="font-medium">
                              {currentResume?.sections?.length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Keywords</span>
                            <span className="font-medium">
                              {currentResume?.sections?.reduce((acc, section) => acc + section.keywords.length, 0) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center">
                      <Button
                        onClick={handleGeneratePDF}
                        disabled={generatePDFMutation.isPending}
                        size="lg"
                        className="w-full md:w-auto"
                      >
                        {generatePDFMutation.isPending ? 'Generating...' : 'Download PDF Resume'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}