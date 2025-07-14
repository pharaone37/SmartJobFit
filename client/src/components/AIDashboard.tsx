import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  MessageCircle, 
  Building, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function AIDashboard() {
  const aiTools = [
    {
      title: "Resume Analyzer",
      description: "AI-powered resume analysis with ATS scoring and optimization suggestions",
      href: "/resume-analyzer",
      icon: FileText,
      features: ["ATS Compatibility Score", "Keyword Analysis", "Skills Assessment", "Improvement Recommendations"],
      color: "blue"
    },
    {
      title: "Interview Preparation",
      description: "Practice with AI-generated questions and get personalized feedback",
      href: "/ai-interview-prep",
      icon: MessageCircle,
      features: ["Custom Question Generation", "Performance Analysis", "Real-time Feedback", "Progress Tracking"],
      color: "green"
    },
    {
      title: "Cover Letter Generator",
      description: "Create personalized cover letters tailored to specific jobs and companies",
      href: "/cover-letter",
      icon: Target,
      features: ["Job-specific Customization", "Company Research Integration", "Professional Templates", "Export Options"],
      color: "purple"
    },
    {
      title: "Company Insights",
      description: "Research companies with comprehensive AI-powered insights and data",
      href: "/company-insights",
      icon: Building,
      features: ["Company Culture Analysis", "Salary Research", "Interview Process Info", "Growth Opportunities"],
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
      case 'green': return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'purple': return 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700';
      case 'orange': return 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700';
      default: return 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Career Tools
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Supercharge your job search with cutting-edge AI technology. Get personalized insights, 
          optimized resumes, and interview preparation powered by OpenRouter.ai.
        </p>
        <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          All AI features now powered by OpenRouter.ai
        </Badge>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(tool.color)} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    AI-Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${getIconColorClasses(tool.color)}`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  asChild 
                  className={`w-full bg-gradient-to-r ${getColorClasses(tool.color)} text-white border-0 group-hover:shadow-lg transition-all duration-300`}
                >
                  <Link to={tool.href} className="flex items-center justify-center gap-2">
                    Launch {tool.title}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-sm text-gray-600">Resume Optimization Success Rate</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
            <p className="text-sm text-gray-600">Faster Job Search Process</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
            <p className="text-sm text-gray-600">Interview Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced AI Services */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Enterprise-Grade AI Services
          </CardTitle>
          <CardDescription>
            Twelve specialized AI providers delivering enterprise-level capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                OpenRouter.ai
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Claude 3.5 Sonnet integration</li>
                <li>• General AI features</li>
                <li>• Better rate limits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Eden AI + Affinda
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Advanced resume parsing</li>
                <li>• Multilingual support</li>
                <li>• DSGVO-ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Google Gemini 2.5
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Job matching intelligence</li>
                <li>• Cover letter generation</li>
                <li>• Multimodal capabilities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Serper API
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Enhanced job search</li>
                <li>• Google Search integration</li>
                <li>• Structured company data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Rezi API
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Professional resume optimization</li>
                <li>• Cover letter generation</li>
                <li>• ATS-friendly formatting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sovren Enterprise
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Semantic scoring engine</li>
                <li>• Enterprise parser</li>
                <li>• Extremely precise matching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                HireEZ Talent Intelligence
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Talent intelligence engine</li>
                <li>• B2B matching optimization</li>
                <li>• Career trajectory analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Skillate AI Graph
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• AI-powered skill graphs</li>
                <li>• Job matching with ML</li>
                <li>• Skill development plans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Kickresume AI
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Intelligent CV builder</li>
                <li>• GPT-powered templates</li>
                <li>• ATS optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Teal HQ Tracker
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Job application tracking</li>
                <li>• Resume performance analysis</li>
                <li>• Career coaching insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Custom GPT-4o/Claude Flow
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Custom rewrite module</li>
                <li>• Advanced cover letters</li>
                <li>• Style optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Fallback Active</Badge>
                Rchilli + HubSpot
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• ATS-optimized parsing</li>
                <li>• CRM integration</li>
                <li>• Ontology support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Link to="/resume-analyzer">
            <FileText className="w-5 h-5 mr-2" />
            Start with Resume Analysis
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <Link to="/jobs">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Job Opportunities
          </Link>
        </Button>
      </div>
    </div>
  );
}