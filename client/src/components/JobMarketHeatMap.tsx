import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, DollarSign, Users } from 'lucide-react';

interface LocationData {
  city: string;
  state: string;
  jobCount: number;
  avgSalary: number;
  industry: string;
  growth: number;
  coordinates?: [number, number];
}

interface HeatMapProps {
  selectedIndustry?: string;
  onLocationSelect?: (location: LocationData) => void;
}

export default function JobMarketHeatMap({ selectedIndustry, onLocationSelect }: HeatMapProps) {
  const [industry, setIndustry] = useState(selectedIndustry || 'technology');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'engineering', label: 'Engineering' }
  ];

  const mockLocationData: LocationData[] = [
    { city: 'San Francisco', state: 'CA', jobCount: 1250, avgSalary: 165000, industry: 'technology', growth: 15.2 },
    { city: 'Seattle', state: 'WA', jobCount: 980, avgSalary: 145000, industry: 'technology', growth: 12.8 },
    { city: 'New York', state: 'NY', jobCount: 1420, avgSalary: 155000, industry: 'finance', growth: 8.5 },
    { city: 'Austin', state: 'TX', jobCount: 750, avgSalary: 125000, industry: 'technology', growth: 18.3 },
    { city: 'Boston', state: 'MA', jobCount: 680, avgSalary: 140000, industry: 'healthcare', growth: 10.2 },
    { city: 'Los Angeles', state: 'CA', jobCount: 890, avgSalary: 135000, industry: 'marketing', growth: 7.9 },
    { city: 'Chicago', state: 'IL', jobCount: 720, avgSalary: 118000, industry: 'finance', growth: 6.4 },
    { city: 'Denver', state: 'CO', jobCount: 520, avgSalary: 115000, industry: 'technology', growth: 14.7 },
    { city: 'Atlanta', state: 'GA', jobCount: 610, avgSalary: 108000, industry: 'healthcare', growth: 11.1 },
    { city: 'Miami', state: 'FL', jobCount: 450, avgSalary: 95000, industry: 'marketing', growth: 9.3 }
  ];

  useEffect(() => {
    const fetchLocationData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filteredData = mockLocationData.filter(location => 
        location.industry === industry
      );
      setLocations(filteredData);
      setLoading(false);
    };

    fetchLocationData();
  }, [industry]);

  const getHeatIntensity = (jobCount: number) => {
    if (jobCount > 1000) return 'high';
    if (jobCount > 500) return 'medium';
    return 'low';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-500/80 hover:bg-red-600/90';
      case 'medium': return 'bg-orange-500/80 hover:bg-orange-600/90';
      case 'low': return 'bg-yellow-500/80 hover:bg-yellow-600/90';
      default: return 'bg-gray-500/80';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Job Market Heat Map
          </CardTitle>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading job market data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Heat Map Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {locations.map((location, index) => {
                const intensity = getHeatIntensity(location.jobCount);
                const colorClass = getIntensityColor(intensity);
                
                return (
                  <div
                    key={index}
                    className={`${colorClass} rounded-lg p-4 text-white cursor-pointer transition-all duration-200 transform hover:scale-105`}
                    onClick={() => onLocationSelect?.(location)}
                  >
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {location.city}, {location.state}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{location.jobCount.toLocaleString()} jobs</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4" />
                        <span>${location.avgSalary.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        <span>+{location.growth}% growth</span>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs">
                        {intensity.toUpperCase()} DEMAND
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">High Demand (1000+ jobs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Medium Demand (500-1000 jobs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Low Demand (&lt;500 jobs)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}