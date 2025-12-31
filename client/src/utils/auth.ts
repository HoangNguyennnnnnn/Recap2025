import { v4 as uuidv4 } from 'uuid';

const TOKEN_KEY = 'love_universe_session_token';
const REMEMBER_ME_KEY = 'remember_me';

/**
 * Generate a unique session token
 */
export const generateToken = (): string => {
  return uuidv4();
};

/**
 * Store session token in localStorage or sessionStorage
 */
export const storeToken = (token: string, rememberMe: boolean): void => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_ME_KEY, 'true');
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_ME_KEY, 'false');
  }
};

/**
 * Retrieve session token from storage
 */
export const getToken = (): string | null => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  
  if (rememberMe) {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return sessionStorage.getItem(TOKEN_KEY);
  }
};

/**
 * Check if user has valid session
 */
export const hasValidSession = (): boolean => {
  const token = getToken();
  return token !== null && token.length > 0;
};

/**
 * Clear session token
 */
export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
};
