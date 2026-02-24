import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { verifyClaimApi } from '../api/factCheckApi';
import type { VerificationRequest, VerificationResponse } from '../../../types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface UseVerifyClaimOptions {
  onSuccess?: (data: VerificationResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to verify a claim using the fact-checking API
 */
export const useVerifyClaim = (options?: UseVerifyClaimOptions) => {
  return useMutation<VerificationResponse, AxiosError, VerificationRequest>({
    mutationFn: (request: VerificationRequest) => verifyClaimApi(request),
    onSuccess: data => {
      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: error => {
      console.error('Fact check error:', error);

      const errorMessage =
        (error.response?.data as { detail?: string })?.detail ||
        (error as any).message ||
        'Failed to verify claim. Please try again.';

      toast.error(errorMessage);

      // Call custom error handler if provided
      options?.onError?.(error as Error);
    },
  });
};

/**
 * Mutation options type for custom usage
 */
export type VerifyClaimMutationOptions = UseMutationOptions<
  VerificationResponse,
  AxiosError,
  VerificationRequest
>;
