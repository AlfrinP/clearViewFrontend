import { apiClient } from '../../../services/apiClient';
import type { VerificationRequest, VerificationResponse } from '../../../types/api';

/**
 * Verify a claim using the backend fact-checking system
 */
export const verifyClaimApi = async (
  request: VerificationRequest
): Promise<VerificationResponse> => {
  const response = await apiClient.post<VerificationResponse>(
    '/api/v1/verify',
    request
  );

  return response.data;
};

/**
 * Legacy endpoint for backwards compatibility
 */
export const verifyNewsLegacyApi = async (news: string): Promise<VerificationResponse> => {
  const response = await apiClient.post<VerificationResponse>('/verify-news', {
    news,
  });

  return response.data;
};
