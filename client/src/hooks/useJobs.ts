import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, JobSearchFilters, applicationApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useJobSearch(query: string, filters: JobSearchFilters = {}, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["/api/jobs/search", query, filters, page, limit],
    queryFn: () => jobsApi.search(query, filters, page, limit),
    enabled: !!query || Object.keys(filters).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useJobRecommendations(limit = 10) {
  return useQuery({
    queryKey: ["/api/jobs/recommendations", limit],
    queryFn: () => jobsApi.getRecommendations(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["/api/jobs", id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobApplications() {
  return useQuery({
    queryKey: ["/api/applications"],
    queryFn: applicationApi.getAll,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useJobApplicationStats() {
  return useQuery({
    queryKey: ["/api/applications/stats"],
    queryFn: applicationApi.getStats,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ jobId, resumeId }: { jobId: string; resumeId?: string }) =>
      jobsApi.apply(jobId, resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/stats"] });
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      applicationApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/stats"] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
