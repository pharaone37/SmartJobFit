import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Palette, Download, Save, Eye, Edit3, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

interface ResumeStyle {
  template: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  headerStyle: string;
  sectionSpacing: number;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev"
  },
  summary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      startDate: "2022-01",
      endDate: "Present",
      description: "Lead development of scalable web applications using React and Node.js. Improved system performance by 40% through optimization."
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "2021-12",
      description: "Developed mobile-first applications and APIs. Collaborated with cross-functional teams to deliver features on time."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      graduationDate: "2020-05",
      gpa: "3.8"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "Git"],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration and inventory management",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"]
    },
    {
      name: "Task Management App",
      description: "Collaborative project management tool with real-time updates",
      technologies: ["React", "Socket.io", "MongoDB", "Express"]
    }
  ]
};

const defaultStyle: ResumeStyle = {
  template: "modern",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  fontFamily: "Inter",
  fontSize: 14,
  lineHeight: 1.5,
  margins: 20,
  headerStyle: "centered",
  sectionSpacing: 16
};

export default function ResumePreview() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [style, setStyle] = useState<ResumeStyle>(defaultStyle);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');

  const { data: templates } = useQuery({
    queryKey: ['/api/resume-templates'],
    staleTime: 300000,
  });

  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest('/api/resume-templates', 'POST', templateData);
    },
    onSuccess: () => {
      toast({
        title: "Template Saved",
        description: "Your resume template has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/resume-templates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleStyleChange = (key: keyof ResumeStyle, value: any) => {
    setStyle(prev => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (section: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ResumeData],
        [field]: value
      }
    }));
  };

  const handleSaveTemplate = () => {
    saveTemplateMutation.mutate({
      name: `Custom Template ${new Date().toLocaleDateString()}`,
      templateData: resumeData,
      styling: style,
      isPublic: false
    });
  };

  const downloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "PDF Generation",
      description: "PDF download functionality would be implemented here.",
    });
  };

  const ResumePreviewComponent = ({ data, styling }: { data: ResumeData; styling: ResumeStyle }) => (
    <div 
      className="w-full max-w-4xl mx-auto bg-white shadow-lg border rounded-lg overflow-hidden"
      style={{
        fontFamily: styling.fontFamily,
        fontSize: `${styling.fontSize}px`,
        lineHeight: styling.lineHeight,
        padding: `${styling.margins}px`,
        color: styling.secondaryColor
      }}
    >
      {/* Header */}
      <div className={`mb-6 ${styling.headerStyle === 'centered' ? 'text-center' : 'text-left'}`}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: styling.primaryColor }}>
          {data.personalInfo.name}
        </h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: styling.primaryColor }}>
          Professional Summary
        </h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: styling.primaryColor }}>
          Work Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold">{exp.title}</h3>
              <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-600 mb-1">{exp.company}, {exp.location}</p>
            <p className="text-sm text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: styling.primaryColor }}>
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: styling.primaryColor }}>
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-3" style={{ color: styling.primaryColor }}>
          Projects
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-700 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, techIndex) => (
                <Badge key={techIndex} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interactive Resume Preview
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Customize your resume with real-time styling and instant preview
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="gap-2"
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button onClick={handleSaveTemplate} className="gap-2">
              <Save className="h-4 w-4" />
              Save Template
            </Button>
            <Button onClick={downloadPDF} variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Styling Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Styling Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Selection */}
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select 
                    value={style.template} 
                    onValueChange={(value) => handleStyleChange('template', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Colors */}
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    type="color"
                    value={style.primaryColor}
                    onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    type="color"
                    value={style.secondaryColor}
                    onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Typography */}
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={style.fontFamily} 
                    onValueChange={(value) => handleStyleChange('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fontSize">Font Size: {style.fontSize}px</Label>
                  <Slider
                    value={[style.fontSize]}
                    onValueChange={(value) => handleStyleChange('fontSize', value[0])}
                    min={10}
                    max={18}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="lineHeight">Line Height: {style.lineHeight}</Label>
                  <Slider
                    value={[style.lineHeight]}
                    onValueChange={(value) => handleStyleChange('lineHeight', value[0])}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Layout */}
                <div>
                  <Label htmlFor="margins">Margins: {style.margins}px</Label>
                  <Slider
                    value={[style.margins]}
                    onValueChange={(value) => handleStyleChange('margins', value[0])}
                    min={10}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="headerStyle">Header Style</Label>
                  <Select 
                    value={style.headerStyle} 
                    onValueChange={(value) => handleStyleChange('headerStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select header style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="left">Left Aligned</SelectItem>
                      <SelectItem value="right">Right Aligned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div>
                  <Label className="text-sm font-medium">Quick Actions</Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStyle(defaultStyle)}
                      className="justify-start"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white min-h-[800px]">
                  <ResumePreviewComponent data={resumeData} styling={style} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}