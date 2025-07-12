import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Building, 
  DollarSign, 
  Clock, 
  Users, 
  GraduationCap,
  Briefcase,
  X,
  Search,
  Filter,
  Globe
} from 'lucide-react';

export interface JobSearchFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remote?: boolean;
  companySize?: string;
  industry?: string;
  benefits?: string[];
  workSchedule?: string;
  educationLevel?: string;
  platforms?: string[];
}

// Platform Logo Component
const PlatformLogo = ({ platform }: { platform: string }) => {
  const logoClass = "w-4 h-4 rounded-sm";
  const platformColors: { [key: string]: string } = {
    'LinkedIn': 'bg-blue-700',
    'Indeed': 'bg-blue-600',
    'Glassdoor': 'bg-green-600',
    'ZipRecruiter': 'bg-blue-500',
    'Monster': 'bg-purple-600',
    'CareerBuilder': 'bg-orange-500',
    'Dice': 'bg-red-600',
    'AngelList': 'bg-black',
    'Stack Overflow': 'bg-orange-600',
    'GitHub Jobs': 'bg-gray-800',
    'Reed (UK)': 'bg-red-500',
    'Xing (DACH)': 'bg-green-700',
    'Seek (Australia)': 'bg-pink-600',
    'Naukri (India)': 'bg-blue-800',
    'StepStone': 'bg-orange-600'
  };
  
  return (
    <div className={`${logoClass} ${platformColors[platform] || 'bg-gray-500'} flex items-center justify-center`}>
      <span className="text-white text-xs font-bold">
        {platform.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

interface JobSearchFiltersProps {
  filters: JobSearchFilters;
  onFiltersChange: (filters: JobSearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export default function JobSearchFilters({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  isLoading = false 
}: JobSearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'
  ];

  const experienceLevels = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Director', 'C-Level'
  ];

  const companySizes = [
    'Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail',
    'Marketing', 'Sales', 'Design', 'Engineering', 'Data Science', 'Product Management'
  ];

  const benefits = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k',
    'Paid Time Off', 'Remote Work', 'Flexible Hours', 'Stock Options',
    'Professional Development', 'Gym Membership', 'Commuter Benefits'
  ];

  const workSchedules = [
    'Monday-Friday', 'Flexible', 'Shift Work', 'Weekend Work', 'On-call'
  ];

  const educationLevels = [
    'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Certification'
  ];

  const platforms = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter', 'Monster', 'CareerBuilder',
    'Dice', 'AngelList', 'Stack Overflow', 'GitHub Jobs', 'Reed (UK)', 'Xing (DACH)',
    'Seek (Australia)', 'Naukri (India)', 'StepStone'
  ];

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills?.includes(skillInput.trim())) {
      onFiltersChange({
        ...filters,
        skills: [...(filters.skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onFiltersChange({
      ...filters,
      skills: filters.skills?.filter(s => s !== skill)
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    const currentBenefits = filters.benefits || [];
    const newBenefits = currentBenefits.includes(benefit)
      ? currentBenefits.filter(b => b !== benefit)
      : [...currentBenefits, benefit];
    
    onFiltersChange({
      ...filters,
      benefits: newBenefits
    });
  };

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = filters.platforms || [];
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    
    onFiltersChange({
      ...filters,
      platforms: newPlatforms
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const handleSalaryChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      salaryMin: values[0] * 1000,
      salaryMax: values[1] * 1000
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Advanced Job Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={filters.location || ''}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Type
            </Label>
            <Select value={filters.jobType || ''} onValueChange={(value) => onFiltersChange({ ...filters, jobType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Experience Level
            </Label>
            <Select value={filters.experienceLevel || ''} onValueChange={(value) => onFiltersChange({ ...filters, experienceLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Skills & Keywords</Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              placeholder="Add skills (e.g., React, Python, Marketing)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button type="button" onClick={addSkill}>Add</Button>
          </div>
          {filters.skills && filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Salary Range (Annual)
          </Label>
          <div className="px-3">
            <Slider
              value={[
                (filters.salaryMin || 0) / 1000,
                (filters.salaryMax || 200) / 1000
              ]}
              onValueChange={handleSalaryChange}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${filters.salaryMin || 0}k</span>
              <span>${filters.salaryMax || 200}k</span>
            </div>
          </div>
        </div>

        {/* Remote Work */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={filters.remote || false}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, remote: checked as boolean })}
          />
          <Label htmlFor="remote">Remote work opportunities</Label>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </Button>
          <Button variant="ghost" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Company Size
                  </Label>
                  <Select value={filters.companySize || ''} onValueChange={(value) => onFiltersChange({ ...filters, companySize: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Industry
                  </Label>
                  <Select value={filters.industry || ''} onValueChange={(value) => onFiltersChange({ ...filters, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Work Schedule
                  </Label>
                  <Select value={filters.workSchedule || ''} onValueChange={(value) => onFiltersChange({ ...filters, workSchedule: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {workSchedules.map(schedule => (
                        <SelectItem key={schedule} value={schedule}>{schedule}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education Level
                  </Label>
                  <Select value={filters.educationLevel || ''} onValueChange={(value) => onFiltersChange({ ...filters, educationLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <Label>Benefits & Perks</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {benefits.map(benefit => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={filters.benefits?.includes(benefit) || false}
                        onCheckedChange={() => handleBenefitToggle(benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <Label>Job Platforms (Select specific platforms or leave empty for all)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {platforms.map(platform => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={filters.platforms?.includes(platform) || false}
                        onCheckedChange={() => handlePlatformToggle(platform)}
                      />
                      <Label htmlFor={platform} className="text-sm flex items-center gap-2">
                        <PlatformLogo platform={platform} />
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Search Button */}
        <Button 
          onClick={onSearch} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </Button>
      </CardContent>
    </Card>
  );
}