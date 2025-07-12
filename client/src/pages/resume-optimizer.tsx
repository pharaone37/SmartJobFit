import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Upload, 
  Download,
  Plus,
  Edit3,
  Trash2,
  Star,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { useResumes, useCreateResume, useUpdateResume, useDeleteResume } from "@/hooks/useResume";
import { ResumeAnalyzer } from "@/components/resume/resume-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Resume } from "@/lib/types";

export default function ResumeOptimizer() {
  const [activeTab, setActiveTab] = useState("resumes");
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");
  const [newResumeContent, setNewResumeContent] = useState("");

  const { data: resumes, isLoading } = useResumes();
  const createResume = useCreateResume();
  const updateResume = useUpdateResume();
  const deleteResume = useDeleteResume();
  const { toast } = useToast();

  const handleCreateResume = async () => {
    if (!newResumeName.trim() || !newResumeContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both resume name and content.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createResume.mutateAsync({
        name: newResumeName,
        content: newResumeContent,
        skills: [],
        experience: [],
        education: [],
        isActive: false
      });
      
      setNewResumeName("");
      setNewResumeContent("");
      setIsCreating(false);
      setActiveTab("resumes");
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume.mutateAsync(resumeId);
        if (selectedResume?.id === resumeId) {
          setSelectedResume(null);
        }
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  const handleSetActive = async (resumeId: string) => {
    try {
      // First, set all resumes to inactive
      if (resumes) {
        await Promise.all(
          resumes
            .filter(r => r.isActive)
            .map(r => updateResume.mutateAsync({ id: r.id, resume: { isActive: false } }))
        );
      }
      
      // Then set the selected resume as active
      await updateResume.mutateAsync({ 
        id: resumeId, 
        resume: { isActive: true } 
      });
    } catch (error) {
      console.error('Failed to set active resume:', error);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score?: number) => {
    if (!score) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Resume Optimizer</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered resume analysis and optimization for better job matches
            </p>
          </div>
          <Button 
            className="button-gradient"
            onClick={() => {
              setIsCreating(true);
              setActiveTab("create");
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Resume
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="analyze">Analyze & Optimize</TabsTrigger>
            <TabsTrigger value="create">Create Resume</TabsTrigger>
          </TabsList>

          {/* My Resumes Tab */}
          <TabsContent value="resumes" className="space-y-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {resumes && resumes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                      <Card key={resume.id} className={resume.isActive ? 'border-primary shadow-lg' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{resume.name}</CardTitle>
                              <CardDescription className="mt-1">
                                Updated {new Date(resume.updatedAt || '').toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              {resume.isActive && (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              )}
                              {resume.atsScore && (
                                <Badge className={getScoreBackground(resume.atsScore)}>
                                  <span className={getScoreColor(resume.atsScore)}>
                                    {resume.atsScore}% ATS
                                  </span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Preview */}
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {resume.content?.substring(0, 150) || 'No content available'}...
                            </p>
                          </div>

                          {/* Skills */}
                          {resume.skills && resume.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {resume.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {resume.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resume.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedResume(resume);
                                  setActiveTab("analyze");
                                }}
                              >
                                <Target className="h-4 w-4 mr-1" />
                                Analyze
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteResume(resume.id)}
                                disabled={deleteResume.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {!resume.isActive && (
                              <Button
                                size="sm"
                                onClick={() => handleSetActive(resume.id)}
                                disabled={updateResume.isPending}
                              >
                                Set Active
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-muted-foreground mb-4">
                        <FileText className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Resumes Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first resume to start optimizing for job applications.
                      </p>
                      <Button 
                        className="button-gradient"
                        onClick={() => {
                          setIsCreating(true);
                          setActiveTab("create");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Resume
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Analyze & Optimize Tab */}
          <TabsContent value="analyze" className="space-y-6">
            {selectedResume ? (
              <div className="space-y-6">
                {/* Resume Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>{selectedResume.name}</span>
                          {selectedResume.isActive && (
                            <Badge className="bg-green-100 text-green-800 ml-2">Active</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Analyze and optimize your resume for better job matches
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Resume Analyzer */}
                <ResumeAnalyzer
                  resumeId={selectedResume.id}
                  resumeContent={selectedResume.content || ''}
                  onOptimize={() => {
                    // Refresh resumes after optimization
                    setActiveTab("resumes");
                  }}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground mb-4">
                    <Target className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select a Resume to Analyze</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a resume from your collection to analyze and optimize.
                  </p>
                  <Button onClick={() => setActiveTab("resumes")}>
                    View My Resumes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Create Resume Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create New Resume</span>
                </CardTitle>
                <CardDescription>
                  Build a new resume or upload an existing one to optimize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resume Name */}
                <div className="space-y-2">
                  <Label htmlFor="resume-name">Resume Name</Label>
                  <Input
                    id="resume-name"
                    placeholder="e.g., Product Manager Resume 2024"
                    value={newResumeName}
                    onChange={(e) => setNewResumeName(e.target.value)}
                  />
                </div>

                {/* Resume Content */}
                <div className="space-y-2">
                  <Label htmlFor="resume-content">Resume Content</Label>
                  <Textarea
                    id="resume-content"
                    placeholder="Paste your resume content here or type it directly..."
                    value={newResumeContent}
                    onChange={(e) => setNewResumeContent(e.target.value)}
                    className="min-h-[300px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    You can paste text from your existing resume or type it directly. 
                    Our AI will analyze and help optimize it.
                  </p>
                </div>

                {/* Upload Option */}
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Or upload your resume file</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, DOC, DOCX files (Coming soon)
                  </p>
                  <Button variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setActiveTab("resumes");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateResume}
                    disabled={createResume.isPending || !newResumeName.trim() || !newResumeContent.trim()}
                    className="button-gradient"
                  >
                    {createResume.isPending ? 'Creating...' : 'Create Resume'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Resume Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Use Action Verbs</p>
                        <p className="text-sm text-muted-foreground">
                          Start bullet points with strong action verbs like "Led," "Developed," "Improved"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Quantify Achievements</p>
                        <p className="text-sm text-muted-foreground">
                          Include numbers, percentages, and metrics to show impact
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Tailor to Job</p>
                        <p className="text-sm text-muted-foreground">
                          Customize your resume for each job application
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Keep It Concise</p>
                        <p className="text-sm text-muted-foreground">
                          Aim for 1-2 pages maximum, focus on relevant experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Use Keywords</p>
                        <p className="text-sm text-muted-foreground">
                          Include industry-specific keywords from job descriptions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-semibold">Proofread Carefully</p>
                        <p className="text-sm text-muted-foreground">
                          Check for spelling, grammar, and formatting errors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
