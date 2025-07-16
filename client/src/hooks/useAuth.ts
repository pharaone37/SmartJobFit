import { useQuery } from "@tanstack/react-query";

// Get token from localStorage
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
export function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

export function useAuth() {
  const token = getToken();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!token,
    queryFn: async () => {
      if (!token) return null;
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken();
        }
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    error,
  };
}
