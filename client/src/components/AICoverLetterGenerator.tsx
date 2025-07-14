import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Building, 
  CheckCircle, 
  Target,
  Lightbulb,
  Copy,
  Download,
  Send,
  Sparkles
} from "lucide-react";

interface CoverLetterResponse {
  coverLetter: string;
  keyPoints: string[];
  companySpecific: string[];
  callToAction: string;
  tips: string[];
}

interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
}

export default function AICoverLetterGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    description: ""
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<CoverLetterResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCoverLetterMutation = useMutation({
    mutationFn: async (data: { resumeContent: string; jobDescription: string; companyInfo: CompanyInfo }) => {
      return await apiRequest('/api/cover-letter/generate', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setGeneratedCoverLetter(data);
      toast({
        title: "Cover Letter Generated",
        description: "Your personalized cover letter has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!resumeContent || !jobDescription || !companyInfo.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in your resume, job description, and company name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    generateCoverLetterMutation.mutate({ resumeContent, jobDescription, companyInfo });
  };

  const handleCopyToClipboard = async () => {
    if (!generatedCoverLetter) return;
    
    try {
      await navigator.clipboard.writeText(generatedCoverLetter.coverLetter);
      toast({
        title: "Copied to Clipboard",
        description: "Cover letter has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!generatedCoverLetter) return;
    
    const element = document.createElement("a");
    const file = new Blob([generatedCoverLetter.coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${companyInfo.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const updateCompanyInfo = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
        <p className="text-gray-600">Create personalized cover letters tailored to specific jobs and companies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Content
              </CardTitle>
              <CardDescription>
                Paste your resume content to personalize the cover letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here..."
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description to align the cover letter with requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Provide company details to personalize the cover letter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input
                    placeholder="e.g., Google"
                    value={companyInfo.name}
                    onChange={(e) => updateCompanyInfo('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input
                    placeholder="e.g., Technology"
                    value={companyInfo.industry}
                    onChange={(e) => updateCompanyInfo('industry', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Size</label>
                  <Input
                    placeholder="e.g., 10,000+ employees"
                    value={companyInfo.size}
                    onChange={(e) => updateCompanyInfo('size', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g., San Francisco, CA"
                    value={companyInfo.location}
                    onChange={(e) => updateCompanyInfo('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  placeholder="e.g., https://google.com"
                  value={companyInfo.website}
                  onChange={(e) => updateCompanyInfo('website', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Description</label>
                <Textarea
                  placeholder="Brief description of the company..."
                  value={companyInfo.description}
                  onChange={(e) => updateCompanyInfo('description', e.target.value)}
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerate}
            disabled={generateCoverLetterMutation.isPending || !resumeContent || !jobDescription || !companyInfo.name}
            className="w-full"
            size="lg"
          >
            {generateCoverLetterMutation.isPending ? "Generating..." : "Generate Cover Letter"}
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generatedCoverLetter ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Generated Cover Letter
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyToClipboard}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedCoverLetter.coverLetter}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Key Points Highlighted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedCoverLetter.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Company-Specific Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedCoverLetter.companySpecific.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-purple-600" />
                    Call to Action
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium">{generatedCoverLetter.callToAction}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Customization Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedCoverLetter.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate Your Cover Letter
                </h3>
                <p className="text-gray-600 mb-6">
                  Fill in the required information on the left to create a personalized cover letter
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Resume content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Job description</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Company information</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}