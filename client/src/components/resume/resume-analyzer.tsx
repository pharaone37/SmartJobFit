import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Download,
  Sparkles,
  Target,
  Plus
} from "lucide-react";
import { useState } from "react";
import { useAnalyzeResume, useOptimizeResume } from "@/hooks/useResume";
import { ResumeAnalysis } from "@/lib/types";

interface ResumeAnalyzerProps {
  resumeId: string;
  resumeContent: string;
  onOptimize?: () => void;
}

export function ResumeAnalyzer({ resumeId, resumeContent, onOptimize }: ResumeAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  
  const analyzeResume = useAnalyzeResume();
  const optimizeResume = useOptimizeResume();

  const handleAnalyze = async () => {
    try {
      const result = await analyzeResume.mutateAsync({
        id: resumeId,
        jobDescription: jobDescription || undefined
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    }
  };

  const handleOptimize = async () => {
    if (!jobDescription) return;
    
    try {
      await optimizeResume.mutateAsync({
        id: resumeId,
        jobDescription
      });
      onOptimize?.();
    } catch (error) {
      console.error('Failed to optimize resume:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Job-Specific Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description (Optional)</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here to get targeted optimization suggestions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeResume.isPending}
              className="flex-1"
            >
              {analyzeResume.isPending ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
            {jobDescription && (
              <Button 
                onClick={handleOptimize}
                disabled={optimizeResume.isPending}
                className="button-gradient"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {optimizeResume.isPending ? 'Optimizing...' : 'Optimize'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreBackground(analysis.atsScore)}`}>
                      <CheckCircle className={`h-5 w-5 ${getScoreColor(analysis.atsScore)}`} />
                    </div>
                    <div>
                      <p className="font-semibold">ATS Compatibility</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        How well your resume passes ATS systems
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}%
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreBackground(analysis.keywordOptimization)}`}>
                      <Target className={`h-5 w-5 ${getScoreColor(analysis.keywordOptimization)}`} />
                    </div>
                    <div>
                      <p className="font-semibold">Keyword Optimization</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Relevance to job requirements
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.keywordOptimization)}`}>
                      {analysis.keywordOptimization}%
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreBackground(analysis.impactStatements)}`}>
                      <TrendingUp className={`h-5 w-5 ${getScoreColor(analysis.impactStatements)}`} />
                    </div>
                    <div>
                      <p className="font-semibold">Impact Statements</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantified achievements
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.impactStatements)}`}>
                      {analysis.impactStatements}%
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Analysis Report
              </Button>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 card-gradient rounded-lg border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                          <Plus className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                            Improvement Suggestion
                          </p>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {analysis.missingKeywords.length > 0 && (
                    <div className="p-4 card-gradient-blue rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <Target className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Missing Keywords
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.missingKeywords.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
