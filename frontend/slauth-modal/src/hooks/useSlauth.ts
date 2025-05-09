import { useState } from 'react';
import { loginRequest, signupRequest } from '../utils/authService';

export const useSlauth = (baseUrl: string) => {
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const token = await loginRequest(baseUrl, email, password);
      setError(null);
      return token;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const token = await signupRequest(baseUrl, email, password);
      setError(null);
      return token;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { login, signup, error, setError };
};