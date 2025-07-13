import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, TrendingUp, MessageSquare, DollarSign, X } from 'lucide-react';

interface CompanyInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: any;
  company: string;
  jobTitle: string;
  isGenerating: boolean;
}

export default function CompanyInsightsModal({
  isOpen,
  onClose,
  insights,
  company,
  jobTitle,
  isGenerating
}: CompanyInsightsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Company Insights: {company} - {jobTitle}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Generating company insights...</span>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              {/* Company Overview */}
              {insights.companyOverview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Company Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.companyOverview}</p>
                  </CardContent>
                </Card>
              )}

              {/* Work Environment */}
              {insights.workEnvironment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Work Environment & Culture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.workEnvironment}</p>
                  </CardContent>
                </Card>
              )}

              {/* Interview Process */}
              {insights.interviewProcess && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Interview Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.interviewProcess}</p>
                  </CardContent>
                </Card>
              )}

              {/* Common Interview Questions */}
              {insights.interviewQuestions && insights.interviewQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Common Interview Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insights.interviewQuestions.map((question: string, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded">
                          <p className="text-sm">{question}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Salary Information */}
              {insights.salaryRange && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Salary & Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.salaryRange}</p>
                  </CardContent>
                </Card>
              )}

              {/* Growth Opportunities */}
              {insights.growthOpportunities && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Growth Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.growthOpportunities}</p>
                  </CardContent>
                </Card>
              )}

              {/* Application Tips */}
              {insights.applicationTips && insights.applicationTips.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Application Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insights.applicationTips.map((tip: string, index: number) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {tip}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No company insights generated yet.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}