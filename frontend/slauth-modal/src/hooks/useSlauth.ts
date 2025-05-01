import { useState } from "react";
import { createApi } from "../utils/api";

export const useSlauth = (baseUrl: string) => {
  const api = createApi(baseUrl);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("slauth_token", res.data.token);
      setError(null);
      return res.data.token;
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
      return null;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/signup", { email, password });
      localStorage.setItem("slauth_token", res.data.token);
      setError(null);
      return res.data.token;
    } catch (err: any) {
      setError(err.response?.data || "Signup failed");
      return null;
    }
  };

  return { login, signup, error };
};