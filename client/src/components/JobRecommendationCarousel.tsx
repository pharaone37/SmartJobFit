import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Star } from "lucide-react";
import { Job } from "@shared/schema";
import { JobCard } from "./JobCard";
import { useState, useEffect } from "react";

interface JobRecommendationCarouselProps {
  jobs: Job[];
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  bookmarkedJobs?: string[];
  title?: string;
  subtitle?: string;
}

export function JobRecommendationCarousel({
  jobs,
  onBookmark,
  onApply,
  bookmarkedJobs = [],
  title = "Smart Job Recommendations",
  subtitle = "Personalized matches based on your profile"
}: JobRecommendationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleJobs, setVisibleJobs] = useState(3);

  useEffect(() => {
    const updateVisibleJobs = () => {
      if (window.innerWidth < 768) {
        setVisibleJobs(1);
      } else if (window.innerWidth < 1024) {
        setVisibleJobs(2);
      } else {
        setVisibleJobs(3);
      }
    };

    updateVisibleJobs();
    window.addEventListener('resize', updateVisibleJobs);
    return () => window.removeEventListener('resize', updateVisibleJobs);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + visibleJobs >= jobs.length ? 0 : prev + visibleJobs
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - visibleJobs < 0 ? Math.max(0, jobs.length - visibleJobs) : prev - visibleJobs
    );
  };

  const canGoNext = currentIndex + visibleJobs < jobs.length;
  const canGoPrev = currentIndex > 0;

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No recommendations yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            Complete your profile to get personalized job recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={!canGoPrev}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={!canGoNext}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleJobs)}%)`,
            width: `${(jobs.length / visibleJobs) * 100}%`
          }}
        >
          {jobs.map((job, index) => (
            <div 
              key={job.id} 
              className={`flex-shrink-0 ${
                visibleJobs === 1 ? 'w-full' : 
                visibleJobs === 2 ? 'w-1/2' : 'w-1/3'
              }`}
              style={{ paddingRight: index === jobs.length - 1 ? '0' : '1rem' }}
            >
              <JobCard
                job={job}
                onBookmark={onBookmark}
                onApply={onApply}
                isBookmarked={bookmarkedJobs.includes(job.id)}
                showMatchScore={true}
                compact={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(jobs.length / visibleJobs) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * visibleJobs)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / visibleJobs) === index
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {jobs.filter(job => job.matchScore && job.matchScore >= 80).length} High Matches
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {jobs.filter(job => job.matchScore && job.matchScore >= 90).length} Perfect Matches
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {jobs.length} recommendations
          </Badge>
        </div>
      </div>
    </div>
  );
}