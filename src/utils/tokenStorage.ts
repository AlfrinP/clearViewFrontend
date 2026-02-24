// Token storage utilities

const TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getTokenType(): string | null {
    return localStorage.getItem(TOKEN_TYPE_KEY);
  },

  setToken(token: string, tokenType: string = 'bearer'): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
  },

  hasToken(): boolean {
    return !!this.getToken();
  },

  getAuthHeader(): string | null {
    const token = this.getToken();
    const tokenType = this.getTokenType();
    
    if (!token) return null;
    
    return `${tokenType || 'Bearer'} ${token}`;
  },
};
