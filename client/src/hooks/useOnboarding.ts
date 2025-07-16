import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface OnboardingState {
  isCompleted: boolean;
  completedAt?: string;
  currentStep?: number;
  skippedSteps?: string[];
  preferences?: {
    showTips: boolean;
    autoAdvance: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'never';
  };
}

export function useOnboarding() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Fetch onboarding state
  const { data: onboardingState, isLoading } = useQuery({
    queryKey: ['/api/user/onboarding'],
    enabled: !!user,
    retry: false,
    initialData: {
      isCompleted: false,
      preferences: {
        showTips: true,
        autoAdvance: false,
        reminderFrequency: 'weekly' as const
      }
    }
  });

  // Update onboarding state
  const updateOnboardingMutation = useMutation({
    mutationFn: async (updates: Partial<OnboardingState>) => {
      return apiRequest('/api/user/onboarding', {
        method: 'PATCH',
        body: updates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/onboarding'] });
    }
  });

  // Complete onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/user/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify({ completedAt: new Date().toISOString() })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/onboarding'] });
      setShouldShowTour(false);
    },
    onError: (error) => {
      console.error('Failed to mark onboarding as complete:', error);
    }
  });

  // Skip onboarding
  const skipOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/user/onboarding/skip', {
        method: 'POST',
        body: JSON.stringify({ skippedAt: new Date().toISOString() })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/onboarding'] });
      setShouldShowTour(false);
    },
    onError: (error) => {
      console.error('Failed to skip onboarding:', error);
    }
  });

  // Check if user should see onboarding - only for truly new users
  useEffect(() => {
    if (user && onboardingState && !isLoading) {
      const userCreatedAt = new Date(user.createdAt || '');
      const hoursToOnboarding = 24; // Show onboarding for users created within last 24 hours
      const hoursSinceCreation = (new Date().getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60);
      const isNewUser = hoursSinceCreation <= hoursToOnboarding;
      
      const shouldShow = isNewUser && 
                        !onboardingState.isCompleted && 
                        !localStorage.getItem('onboarding-skipped') &&
                        !localStorage.getItem('onboarding-dismissed');
      setShouldShowTour(shouldShow);
    }
  }, [user, onboardingState, isLoading]);

  // Helper functions
  const startTour = () => {
    setShouldShowTour(true);
    setTourStep(0);
  };

  const closeTour = () => {
    setShouldShowTour(false);
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  const completeTour = () => {
    completeOnboardingMutation.mutate();
  };

  const skipTour = () => {
    skipOnboardingMutation.mutate();
    localStorage.setItem('onboarding-skipped', 'true');
  };

  const updatePreferences = (preferences: Partial<OnboardingState['preferences']>) => {
    updateOnboardingMutation.mutate({
      preferences: {
        ...onboardingState?.preferences,
        ...preferences
      }
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-skipped');
    localStorage.removeItem('onboarding-dismissed');
    updateOnboardingMutation.mutate({
      isCompleted: false,
      completedAt: undefined,
      currentStep: 0
    });
    setShouldShowTour(true);
  };

  // Check if user is new (registered within last 7 days)
  const isNewUser = user && user.createdAt && 
    (new Date().getTime() - new Date(user.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  // Check if profile is incomplete
  const isProfileIncomplete = user && (
    !user.firstName || 
    !user.lastName || 
    !user.skills || 
    !user.experience
  );

  return {
    // State
    onboardingState,
    isLoading,
    shouldShowTour,
    tourStep,
    isNewUser,
    isProfileIncomplete,
    
    // Actions
    startTour,
    closeTour,
    completeTour,
    skipTour,
    updatePreferences,
    resetOnboarding,
    setTourStep,
    
    // Mutations
    isCompleting: completeOnboardingMutation.isPending,
    isSkipping: skipOnboardingMutation.isPending,
    isUpdating: updateOnboardingMutation.isPending
  };
}