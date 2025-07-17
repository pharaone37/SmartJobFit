import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Play, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  success: boolean;
  service?: string;
  message?: string;
  error?: string;
  timestamp: string;
  results?: any;
}

export default function CommunicationTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();

  const services = [
    { name: 'jobSearch', label: 'Job Search Engine', description: 'Test job search and filtering' },
    { name: 'resumeOptimizer', label: 'Resume Optimizer', description: 'Test resume analysis and optimization' },
    { name: 'applicationTracker', label: 'Application Tracker', description: 'Test application management' },
    { name: 'salaryIntelligence', label: 'Salary Intelligence', description: 'Test salary data and insights' },
    { name: 'careerCoaching', label: 'Career Coaching', description: 'Test career advice and guidance' }
  ];

  const runFullCommunicationTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const response = await apiRequest('/api/test/communication', {
        method: 'POST',
        body: JSON.stringify({})
      });
      
      setTestResults([response]);
      toast({
        title: "Communication Test Completed",
        description: response.success ? "All tests passed successfully!" : "Some tests failed",
        variant: response.success ? "default" : "destructive"
      });
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      setTestResults([errorResult]);
      toast({
        title: "Communication Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runIndividualServiceTest = async (serviceName: string) => {
    setIsRunning(true);
    setSelectedService(serviceName);
    
    try {
      const response = await apiRequest(`/api/test/service/${serviceName}`, {
        method: 'POST',
        body: JSON.stringify({
          testData: {
            // Add service-specific test data here
          }
        })
      });
      
      setTestResults(prev => [response, ...prev]);
      toast({
        title: `${serviceName} Test Completed`,
        description: response.success ? "Service test passed!" : "Service test failed",
        variant: response.success ? "default" : "destructive"
      });
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        service: serviceName,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      setTestResults(prev => [errorResult, ...prev]);
      toast({
        title: `${serviceName} Test Failed`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setSelectedService(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Communication Test Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test communication between different sections and services before AWS migration
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Full Communication Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Full Communication Test
            </CardTitle>
            <CardDescription>
              Run comprehensive tests across all services and data exchange flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runFullCommunicationTest}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Full Communication Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Individual Service Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Service Tests</CardTitle>
            <CardDescription>
              Test specific services individually to isolate any issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{service.label}</CardTitle>
                    <CardDescription className="text-xs">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runIndividualServiceTest(service.name)}
                      disabled={isRunning}
                      className="w-full"
                    >
                      {isRunning && selectedService === service.name ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-3 w-3" />
                          Test {service.label}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            Latest test results and communication flow status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tests run yet. Click "Run Full Communication Test" to start.
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-semibold">
                        {result.service ? `${result.service} Test` : 'Full Communication Test'}
                      </span>
                    </div>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  
                  {result.message && (
                    <div className="text-sm mb-2">
                      {result.message}
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.results && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400">
                        View detailed results
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.results, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}