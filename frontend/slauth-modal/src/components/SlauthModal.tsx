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
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, signup, error, setError } = useSlauth(baseUrl);

  const handleSubmit = async () => {
    if (isSignup && password !== confirmPassword) return;

    setIsLoading(true);
    const action = isSignup ? signup : login;
    const token = await action(email, password);
    setIsLoading(false);

    if (token && onLoginSuccess) {
      onLoginSuccess(token);
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    // Clear form fields on mode switch
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="bg-sloth-bg text-sloth-text p-8 rounded-2xl shadow-xl w-[24rem] transition-all">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>

          <SlauthAuthForm
            isSignup={isSignup}
            isLoading={isLoading}
            error={error}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleSubmit}
          />

          <div className="text-center mt-4 text-sm">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              className="text-sloth-green hover:underline font-medium"
              onClick={toggleMode}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
