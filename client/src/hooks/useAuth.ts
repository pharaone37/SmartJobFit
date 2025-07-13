import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  // Temporarily disable auth query to prevent rate limiting
  const user = null;
  const isLoading = false;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
