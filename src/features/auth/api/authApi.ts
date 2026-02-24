import { apiClient } from '../../../services/apiClient';
import type { Token, LoginRequest } from '../../../types/api';

/**
 * Login with username and password to obtain JWT token
 */
export const loginApi = async (credentials: LoginRequest): Promise<Token> => {
  // API expects form-urlencoded data
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await apiClient.post<Token>('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Logout (client-side only - clear token)
 */
export const logoutApi = (): void => {
  // This is handled in the hook
  // No backend endpoint needed for JWT logout
};
