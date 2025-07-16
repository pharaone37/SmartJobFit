import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Bell, TrendingUp, Target, Settings, BarChart3, Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertProfile {
  id: string;
  alertName: string;
  criteriaJson: any;
  predictionEnabled: boolean;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OpportunityPrediction {
  id: string;
  companyId: string;
  companyName: string;
  predictedRoles: string[];
  confidenceScore: number;
  signalsDetected: any[];
  hiringProbability: number;
  expectedTimeframe: string;
  skillsInDemand: string[];
  predictionDate: string;
}

interface MarketSignal {
  id: string;
  signalType: string;
  companyName: string;
  signalData: any;
  impactScore: number;
  detectionDate: string;
}

interface AlertDashboard {
  alertProfiles: AlertProfile[];
  opportunities: OpportunityPrediction[];
  userPreferences: any;
  analytics: any[];
  summary: {
    totalAlerts: number;
    activeAlerts: number;
    predictedOpportunities: number;
    highConfidenceOpportunities: number;
  };
}

export default function JobAlerts() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAlert, setSelectedAlert] = useState<AlertProfile | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch alert dashboard data
  const { data: dashboard, isLoading: dashboardLoading } = useQuery<AlertDashboard>({
    queryKey: ['/api/job-alerts/dashboard'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<OpportunityPrediction[]>({
    queryKey: ['/api/job-alerts/opportunities'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch market intelligence
  const { data: marketSignals, isLoading: marketLoading } = useQuery<MarketSignal[]>({
    queryKey: ['/api/job-alerts/market-intelligence'],
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      return await apiRequest('/api/job-alerts/profiles', {
        method: 'POST',
        body: JSON.stringify(alertData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Alert Created",
        description: "Your job alert has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-alerts/dashboard'] });
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return await apiRequest(`/api/job-alerts/profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    onSuccess: () => {
      toast({
        title: "Alert Updated",
        description: "Your job alert has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-alerts/dashboard'] });
      setSelectedAlert(null);
    }
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await apiRequest(`/api/job-alerts/profiles/${alertId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "Alert Deleted",
        description: "Your job alert has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-alerts/dashboard'] });
    }
  });

  const handleCreateAlert = (formData: any) => {
    const alertData = {
      alertName: formData.alertName,
      criteria: {
        keywords: formData.keywords?.split(',').map((k: string) => k.trim()) || [],
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryRange: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined
        },
        skills: formData.skills?.split(',').map((s: string) => s.trim()) || [],
        companies: formData.companies?.split(',').map((c: string) => c.trim()) || [],
        industries: formData.industries?.split(',').map((i: string) => i.trim()) || [],
        excludeTerms: formData.excludeTerms?.split(',').map((e: string) => e.trim()) || [],
        priority: formData.priority || 'medium'
      },
      predictionEnabled: formData.predictionEnabled ?? true,
      frequency: formData.frequency || 'daily'
    };
    
    createAlertMutation.mutate(alertData);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'funding': return 'bg-green-100 text-green-800';
      case 'expansion': return 'bg-blue-100 text-blue-800';
      case 'hiring': return 'bg-purple-100 text-purple-800';
      case 'news': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Alerts & Intelligence</h1>
          <p className="text-gray-600 mt-1">Predictive opportunity discovery with intelligent market analysis</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.activeAlerts || 0}</div>
            <p className="text-xs text-gray-600">
              {dashboard?.summary.totalAlerts || 0} total alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Opportunities</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.predictedOpportunities || 0}</div>
            <p className="text-xs text-gray-600">
              {dashboard?.summary.highConfidenceOpportunities || 0} high confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Signals</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketSignals?.length || 0}</div>
            <p className="text-xs text-gray-600">
              {marketSignals?.filter(s => s.impactScore >= 0.8).length || 0} high impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-gray-600">
              relevance score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="alerts">My Alerts</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Opportunities</CardTitle>
                <CardDescription>Latest predicted opportunities based on your alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities?.slice(0, 3).map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{opportunity.companyName}</h4>
                        <p className="text-sm text-gray-600">{opportunity.predictedRoles.join(', ')}</p>
                      </div>
                      <Badge className={getConfidenceColor(opportunity.confidenceScore)}>
                        {Math.round(opportunity.confidenceScore * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {opportunity.expectedTimeframe}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={opportunity.hiringProbability * 100} className="flex-1" />
                      <span className="text-xs">{Math.round(opportunity.hiringProbability * 100)}% hiring probability</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Signals */}
            <Card>
              <CardHeader>
                <CardTitle>Market Signals</CardTitle>
                <CardDescription>Real-time market intelligence and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketSignals?.slice(0, 3).map((signal) => (
                  <div key={signal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{signal.companyName}</h4>
                        <Badge className={getSignalTypeColor(signal.signalType)}>
                          {signal.signalType}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Impact: {Math.round(signal.impactScore * 100)}%</div>
                        <div className="text-xs text-gray-600">
                          {new Date(signal.detectionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {signal.signalData?.description || 'Market signal detected'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicted Opportunities</CardTitle>
              <CardDescription>AI-powered opportunity discovery with market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunitiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  opportunities?.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{opportunity.companyName}</h3>
                          <p className="text-gray-600">{opportunity.predictedRoles.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getConfidenceColor(opportunity.confidenceScore)}>
                            {Math.round(opportunity.confidenceScore * 100)}% confidence
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{opportunity.expectedTimeframe}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Skills in Demand</h4>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.skillsInDemand.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Market Signals</h4>
                          <div className="space-y-1">
                            {opportunity.signalsDetected.map((signal, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {signal.type}: {Math.round(signal.confidence * 100)}%
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Hiring Probability:</span>
                          <Progress value={opportunity.hiringProbability * 100} className="w-24" />
                          <span className="text-sm">{Math.round(opportunity.hiringProbability * 100)}%</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Alert Profiles</CardTitle>
              <CardDescription>Manage your job alerts and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard?.alertProfiles?.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{alert.alertName}</h3>
                        <p className="text-sm text-gray-600">
                          {alert.frequency} • {alert.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={alert.isActive}
                          onCheckedChange={(checked) => {
                            updateAlertMutation.mutate({
                              id: alert.id,
                              updates: { isActive: checked }
                            });
                          }}
                        />
                        <Button size="sm" variant="outline" onClick={() => setSelectedAlert(alert)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteAlertMutation.mutate(alert.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Keywords:</span>
                        <p>{alert.criteriaJson?.processed?.keywords?.join(', ') || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p>{alert.criteriaJson?.processed?.location || 'Any location'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
              <CardDescription>Real-time market signals and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  marketSignals?.map((signal) => (
                    <div key={signal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{signal.companyName}</h3>
                          <Badge className={getSignalTypeColor(signal.signalType)}>
                            {signal.signalType}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Impact: {Math.round(signal.impactScore * 100)}%</div>
                          <div className="text-sm text-gray-600">
                            {new Date(signal.detectionDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {signal.signalData?.description || 'Market signal detected'}
                      </p>
                      
                      {signal.signalData?.amount && (
                        <div className="text-sm">
                          <span className="font-medium">Amount:</span> {signal.signalData.amount}
                        </div>
                      )}
                      
                      {signal.signalData?.investors && (
                        <div className="text-sm">
                          <span className="font-medium">Investors:</span> {signal.signalData.investors.join(', ')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive job alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Notification Channels</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="email" defaultChecked />
                      <Label htmlFor="email">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="push" defaultChecked />
                      <Label htmlFor="push">Push notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sms" />
                      <Label htmlFor="sms">SMS alerts</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Alert Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-sm">Start</Label>
                      <Input type="time" defaultValue="22:00" />
                    </div>
                    <div>
                      <Label className="text-sm">End</Label>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>
                
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Alert Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Job Alert</CardTitle>
              <CardDescription>Set up intelligent job alerts with predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData);
                handleCreateAlert(data);
              }} className="space-y-4">
                <div>
                  <Label htmlFor="alertName">Alert Name</Label>
                  <Input
                    id="alertName"
                    name="alertName"
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    placeholder="e.g., React, TypeScript, Frontend"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., San Francisco, Remote"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select name="jobType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryMin">Minimum Salary</Label>
                    <Input
                      id="salaryMin"
                      name="salaryMin"
                      type="number"
                      placeholder="e.g., 80000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                      id="salaryMax"
                      name="salaryMax"
                      type="number"
                      placeholder="e.g., 150000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., JavaScript, Python, AWS"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companies">Target Companies (comma-separated)</Label>
                  <Input
                    id="companies"
                    name="companies"
                    placeholder="e.g., Google, Microsoft, Startup"
                  />
                </div>
                
                <div>
                  <Label htmlFor="frequency">Alert Frequency</Label>
                  <Select name="frequency">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="predictionEnabled" name="predictionEnabled" defaultChecked />
                  <Label htmlFor="predictionEnabled">Enable predictive analytics</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAlertMutation.isPending}
                  >
                    {createAlertMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Alert'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}