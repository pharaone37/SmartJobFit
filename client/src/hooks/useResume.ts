import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi, Resume } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useResumes() {
  return useQuery({
    queryKey: ["/api/resumes"],
    queryFn: resumeApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ["/api/resumes", id],
    queryFn: () => resumeApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (resume: Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      resumeApi.create(resume),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Created",
        description: "Your resume has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, resume }: { id: string; resume: Partial<Resume> }) =>
      resumeApi.update(id, resume),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", data.id] });
      toast({
        title: "Resume Updated",
        description: "Your resume has been updated successfully.",
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

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAnalyzeResume() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, jobDescription }: { id: string; jobDescription?: string }) =>
      resumeApi.analyze(id, jobDescription),
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useOptimizeResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, jobDescription }: { id: string; jobDescription: string }) =>
      resumeApi.optimize(id, jobDescription),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Optimized",
        description: "Your optimized resume has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Optimization Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
