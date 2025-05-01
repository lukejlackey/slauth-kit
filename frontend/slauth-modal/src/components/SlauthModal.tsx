// src/components/SlauthModal.tsx
import { useState } from "react";
import { useSlauth } from "../hooks/useSlauth";

export interface SlauthModalProps {
  baseUrl: string;
  onLoginSuccess?: (token: string) => void;
}

export const SlauthModal = ({ baseUrl, onLoginSuccess }: SlauthModalProps) => {
  const { login, signup, error } = useSlauth(baseUrl);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = isSignup ? signup : login;
    const token = await action(email, password);
    if (token && onLoginSuccess) {
      onLoginSuccess(token);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 mb-2 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 mb-2 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-red-500 text-sm mb-2">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          )}
          <button
            className="bg-blue-500 text-white p-2 w-full rounded"
            type="submit"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};
