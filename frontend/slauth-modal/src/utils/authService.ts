import { createApi } from './api';

/**
 * Performs a login request and stores the returned JWT in localStorage.
 * @param baseUrl - the base URL of the Slauth API
 * @param email
 * @param password
 * @returns The JWT token on success
 * @throws Error with the server’s message on failure
 */
export async function loginRequest(
  baseUrl: string,
  email: string,
  password: string
): Promise<string> {
  const api = createApi(baseUrl);
  try {
    const res = await api.post('/api/auth/login', { email, password });
    const token = res.data.token as string;
    localStorage.setItem('slauth_token', token);
    return token;
  } catch (err: any) {
    // Normalize error
    const msg = err.response?.data || err.message || 'Login failed';
    throw new Error(msg);
  }
}

/**
 * Performs a signup request and stores the returned JWT in localStorage.
 * @param baseUrl - the base URL of the Slauth API
 * @param email
 * @param password
 * @returns The JWT token on success
 * @throws Error with the server’s message on failure
 */
export async function signupRequest(
  baseUrl: string,
  email: string,
  password: string
): Promise<string> {
  const api = createApi(baseUrl);
  try {
    const res = await api.post('/api/auth/signup', { email, password });
    const token = res.data.token as string;
    localStorage.setItem('slauth_token', token);
    return token;
  } catch (err: any) {
    // Normalize error
    const msg = err.response?.data || err.message || 'Signup failed';
    throw new Error(msg);
  }
}