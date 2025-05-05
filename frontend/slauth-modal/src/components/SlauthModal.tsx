import { useState } from "react";
import { motion } from "framer-motion";
import { useSlauth } from "../hooks/useSlauth";
import { SlauthAuthForm } from "./SlauthAuthForm";

export interface SlauthModalProps {
  baseUrl: string;
  onLoginSuccess?: (token: string) => void;
}

export const SlauthModal = ({ baseUrl, onLoginSuccess }: SlauthModalProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ⬅️ NEW
  const { login, signup, error } = useSlauth(baseUrl);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    const action = isSignup ? signup : login;
    const token = await action(email, password);
    setIsLoading(false);

    if (token && onLoginSuccess) {
      onLoginSuccess(token);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="bg-sloth-bg text-sloth-text p-8 rounded-2xl shadow-xl w-full max-w-sm transition-all">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>

          <SlauthAuthForm
            isSignup={isSignup}
            error={error}
            isLoading={isLoading} // ✅ Add this line
            onSubmit={handleSubmit}
          />


          <div className="text-center mt-4 text-sm">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              className="text-sloth-green hover:underline font-medium"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
