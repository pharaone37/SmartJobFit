import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, DollarSign, TrendingUp, Users, Building, Target, MessageSquare, BarChart3, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SalaryIntelligenceProps {
  userId: string;
}

export default function SalaryIntelligence({ userId }: SalaryIntelligenceProps) {
  const [activeTab, setActiveTab] = useState('market-research');
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    experienceLevel: '',
    industry: '',
    companySize: '',
    skills: [] as string[],
    companyName: '',
    offerData: {
      position: '',
      company: '',
      salary: 0,
      benefits: '',
      location: '',
      experienceLevel: '',
      industry: ''
    },
    negotiationGoals: {
      target: 0,
      priorities: [] as string[]
    }
  });
  const [marketData, setMarketData] = useState<any>(null);
  const [personalizedRange, setPersonalizedRange] = useState<any>(null);
  const [companyInsights, setCompanyInsights] = useState<any>(null);
  const [negotiationStrategy, setNegotiationStrategy] = useState<any>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const { toast } = useToast();

  // Query for user benchmarks
  const { data: userBenchmarks } = useQuery<{benchmarks: any[]}>({
    queryKey: ['/api/salary/benchmarks/user'],
    enabled: !!userId,
    retry: false
  });

  // Query for user negotiations
  const { data: userNegotiations } = useQuery<{negotiations: any[]}>({
    queryKey: ['/api/salary/negotiations/user'],
    enabled: !!userId,
    retry: false
  });

  // Query for market trends
  const { data: marketTrends } = useQuery({
    queryKey: ['/api/salary/market-trends'],
    enabled: !!userId,
    retry: false
  });

  // Market data mutation
  const marketDataMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/salary/market-data', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setMarketData(data.marketData);
      toast({
        title: "Market Data Retrieved",
        description: "Successfully retrieved salary market data",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to retrieve market data",
        variant: "destructive"
      });
    }
  });

  // Personalized range mutation
  const personalizedRangeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/salary/personalized-range', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setPersonalizedRange(data.personalizedRange);
      toast({
        title: "Personalized Range Generated",
        description: "Successfully generated personalized salary range",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate personalized range",
        variant: "destructive"
      });
    }
  });

  // Company insights mutation
  const companyInsightsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/salary/company-insights', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setCompanyInsights(data.companyInsights);
      toast({
        title: "Company Insights Retrieved",
        description: "Successfully retrieved company compensation insights",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to retrieve company insights",
        variant: "destructive"
      });
    }
  });

  // Negotiation strategy mutation
  const negotiationStrategyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/salary/negotiation-strategy', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setNegotiationStrategy(data.negotiationStrategy);
      toast({
        title: "Negotiation Strategy Generated",
        description: "Successfully generated negotiation strategy",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate negotiation strategy",
        variant: "destructive"
      });
    }
  });

  // Negotiation simulation mutation
  const simulationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/salary/negotiation-simulation', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setSimulationActive(true);
      toast({
        title: "Simulation Started",
        description: "Negotiation simulation is now active",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start simulation",
        variant: "destructive"
      });
    }
  });

  const handleMarketResearch = () => {
    const { jobTitle, location, experienceLevel, industry, companySize, skills } = formData;
    
    if (!jobTitle || !location || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title, location, and experience level",
        variant: "destructive"
      });
      return;
    }

    marketDataMutation.mutate({
      jobTitle,
      location,
      experienceLevel,
      industry,
      companySize,
      skills
    });
  };

  const handlePersonalizedAnalysis = () => {
    const { jobTitle, location, experienceLevel, industry, companySize, skills } = formData;
    
    if (!jobTitle || !location || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title, location, and experience level",
        variant: "destructive"
      });
      return;
    }

    personalizedRangeMutation.mutate({
      jobTitle,
      location,
      experienceLevel,
      industry,
      companySize,
      skills
    });
  };

  const handleCompanyAnalysis = () => {
    const { companyName, industry, location } = formData;
    
    if (!companyName) {
      toast({
        title: "Missing Information",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    companyInsightsMutation.mutate({
      companyName,
      industry,
      location
    });
  };

  const handleNegotiationStrategy = () => {
    const { offerData, negotiationGoals } = formData;
    
    if (!offerData.position || !offerData.company || !offerData.salary || !negotiationGoals.target) {
      toast({
        title: "Missing Information",
        description: "Please fill in offer details and negotiation goals",
        variant: "destructive"
      });
      return;
    }

    negotiationStrategyMutation.mutate({
      jobOffer: offerData,
      marketData: marketData || {},
      negotiationGoals
    });
  };

  const handleSimulation = (scenario: string, difficulty: string) => {
    simulationMutation.mutate({
      scenario,
      difficulty
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-6">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-2">Salary Intelligence & Negotiation Coaching</h2>
        <p className="text-sm sm:text-base text-gray-600">AI-powered salary research, market analysis, and negotiation strategy</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto mb-6 bg-transparent border-b border-border p-0">
          <TabsTrigger value="market-research" className="flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            Market Research
          </TabsTrigger>
          <TabsTrigger value="personalized-analysis" className="flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            Personalized Analysis
          </TabsTrigger>
          <TabsTrigger value="company-insights" className="flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            Company Insights
          </TabsTrigger>
          <TabsTrigger value="negotiation-strategy" className="flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            Negotiation Strategy
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            Simulation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market-research">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select onValueChange={(value) => setFormData({...formData, experienceLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => setFormData({...formData, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleMarketResearch} 
                disabled={marketDataMutation.isPending}
                className="w-full"
              >
                {marketDataMutation.isPending ? "Researching..." : "Research Market Data"}
              </Button>

              {marketData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Market Data Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Minimum</p>
                      <p className="text-lg font-semibold">{formatCurrency(marketData.min)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Median</p>
                      <p className="text-lg font-semibold">{formatCurrency(marketData.median)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maximum</p>
                      <p className="text-lg font-semibold">{formatCurrency(marketData.max)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Confidence Score</p>
                    <Progress value={marketData.confidence * 100} className="mt-1" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalized-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personalized Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handlePersonalizedAnalysis} 
                disabled={personalizedRangeMutation.isPending}
                className="w-full mb-4"
              >
                {personalizedRangeMutation.isPending ? "Analyzing..." : "Generate Personalized Range"}
              </Button>

              {personalizedRange && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Your Personalized Range</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Conservative</p>
                        <p className="text-lg font-semibold">{formatCurrency(personalizedRange.min)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="text-lg font-semibold text-green-600">{formatCurrency(personalizedRange.target)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Optimistic</p>
                        <p className="text-lg font-semibold">{formatCurrency(personalizedRange.max)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Factors Considered</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Experience Multiplier</span>
                        <Badge variant="outline">{personalizedRange.factors.experience}x</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Skills Multiplier</span>
                        <Badge variant="outline">{personalizedRange.factors.skills}x</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost of Living</span>
                        <Badge variant="outline">{personalizedRange.factors.costOfLiving}x</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company-insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="e.g., Google"
                />
              </div>

              <Button 
                onClick={handleCompanyAnalysis} 
                disabled={companyInsightsMutation.isPending}
                className="w-full"
              >
                {companyInsightsMutation.isPending ? "Analyzing..." : "Analyze Company"}
              </Button>

              {companyInsights && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Company Compensation Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Average Salary</p>
                        <p className="text-lg font-semibold">{formatCurrency(companyInsights.avgSalary)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salary Range</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(companyInsights.salaryRanges.min)} - {formatCurrency(companyInsights.salaryRanges.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Work-Life Balance</p>
                        <p className="text-lg font-semibold">{companyInsights.workLifeBalance}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Culture Score</p>
                        <p className="text-lg font-semibold">{companyInsights.cultureScore}/5</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Insights</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Negotiation Flexibility</span>
                        <Badge variant={companyInsights.negotiationFlexibility === 'high' ? 'default' : 'secondary'}>
                          {companyInsights.negotiationFlexibility}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Stage</span>
                        <Badge variant="outline">{companyInsights.growthStage}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Equity Policy</span>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negotiation-strategy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Negotiation Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="offerPosition">Position</Label>
                  <Input
                    id="offerPosition"
                    value={formData.offerData.position}
                    onChange={(e) => setFormData({
                      ...formData,
                      offerData: {...formData.offerData, position: e.target.value}
                    })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="offerCompany">Company</Label>
                  <Input
                    id="offerCompany"
                    value={formData.offerData.company}
                    onChange={(e) => setFormData({
                      ...formData,
                      offerData: {...formData.offerData, company: e.target.value}
                    })}
                    placeholder="e.g., Tech Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="offerSalary">Offered Salary</Label>
                  <Input
                    id="offerSalary"
                    type="number"
                    value={formData.offerData.salary}
                    onChange={(e) => setFormData({
                      ...formData,
                      offerData: {...formData.offerData, salary: Number(e.target.value)}
                    })}
                    placeholder="e.g., 120000"
                  />
                </div>
                <div>
                  <Label htmlFor="targetSalary">Target Salary</Label>
                  <Input
                    id="targetSalary"
                    type="number"
                    value={formData.negotiationGoals.target}
                    onChange={(e) => setFormData({
                      ...formData,
                      negotiationGoals: {...formData.negotiationGoals, target: Number(e.target.value)}
                    })}
                    placeholder="e.g., 140000"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNegotiationStrategy} 
                disabled={negotiationStrategyMutation.isPending}
                className="w-full"
              >
                {negotiationStrategyMutation.isPending ? "Generating..." : "Generate Strategy"}
              </Button>

              {negotiationStrategy && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Negotiation Strategy</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Key Talking Points</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {negotiationStrategy.talkingPoints?.map((point: string, index: number) => (
                            <li key={index} className="text-sm">{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Timeline</h4>
                        <p className="text-sm">{negotiationStrategy.timeline}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Alternative Options</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {negotiationStrategy.alternatives?.map((alt: string, index: number) => (
                            <li key={index} className="text-sm">{alt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Tips for Success</h4>
                    <ul className="space-y-1">
                      {negotiationStrategy.tips?.map((tip: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Negotiation Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleSimulation('basic', 'easy')}
                  disabled={simulationMutation.isPending}
                  variant="outline"
                >
                  Easy Scenario
                </Button>
                <Button 
                  onClick={() => handleSimulation('competing_offer', 'medium')}
                  disabled={simulationMutation.isPending}
                  variant="outline"
                >
                  Medium Scenario
                </Button>
                <Button 
                  onClick={() => handleSimulation('difficult_negotiation', 'hard')}
                  disabled={simulationMutation.isPending}
                  variant="outline"
                >
                  Hard Scenario
                </Button>
              </div>

              {simulationActive && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Simulation Active</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Practice your negotiation skills with our AI coach. 
                    The simulation will provide real-time feedback on your responses.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">AI Coach:</p>
                      <p className="text-sm">
                        "Thank you for your interest in the position. We're excited to extend an offer. 
                        Let's discuss the compensation package."
                      </p>
                    </div>
                    <Textarea 
                      placeholder="Type your response here..."
                      className="min-h-20"
                    />
                    <Button size="sm">Send Response</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User History Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBenchmarks?.benchmarks && userBenchmarks.benchmarks.length > 0 ? (
              <div className="space-y-3">
                {userBenchmarks.benchmarks.slice(0, 3).map((benchmark: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{benchmark.jobTitle}</p>
                        <p className="text-sm text-gray-600">{benchmark.location}</p>
                      </div>
                      <Badge variant="outline">{formatCurrency(benchmark.userTarget)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No benchmarks yet. Start with market research!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Negotiation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userNegotiations?.negotiations && userNegotiations.negotiations.length > 0 ? (
              <div className="space-y-3">
                {userNegotiations.negotiations.slice(0, 3).map((negotiation: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{negotiation.positionTitle}</p>
                        <p className="text-sm text-gray-600">{negotiation.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Target: {formatCurrency(negotiation.targetSalary)}</p>
                        <p className="text-sm text-gray-600">Offer: {formatCurrency(negotiation.currentOffer)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No negotiations yet. Generate your first strategy!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}