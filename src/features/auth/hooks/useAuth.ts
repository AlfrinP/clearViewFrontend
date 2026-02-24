import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { loginApi } from '../api/authApi';
import { tokenStorage } from '../../../utils/tokenStorage';
import type { LoginRequest, Token } from '../../../types/api';
import { toast } from 'sonner';

interface UseLoginOptions {
  onSuccess?: (data: Token) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for user login
 */
export const useLogin = (options?: UseLoginOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: data => {
      // Store token
      tokenStorage.setToken(data.access_token, data.token_type);

      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();

      toast.success('Login successful!');

      // Navigate to dashboard
      navigate({ to: '/dashboard/fact-check' });

      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      console.error('Login error:', error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Login failed. Please check your credentials.';

      toast.error(errorMessage);

      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
};

export const useSignup = (options?: UseLoginOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: data => {
      // Store token
      tokenStorage.setToken(data.access_token, data.token_type);

      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();

      toast.success('Login successful!');

      // Navigate to dashboard
      navigate({ to: '/dashboard/fact-check' });

      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      console.error('Login error:', error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Login failed. Please check your credentials.';

      toast.error(errorMessage);

      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    // Clear token
    tokenStorage.clearToken();

    // Clear all cached queries
    queryClient.clear();

    toast.success('Logged out successfully');

    // Navigate to login
    navigate({ to: '/login' });
  };

  return { logout };
};

/**
 * Hook to check if user is authenticated
 */
export const useAuth = () => {
  const isAuthenticated = tokenStorage.hasToken();
  const token = tokenStorage.getToken();

  return {
    isAuthenticated,
    token,
  };
};
