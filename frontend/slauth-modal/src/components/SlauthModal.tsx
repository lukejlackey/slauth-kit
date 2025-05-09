import { useState } from "react";
import { motion } from "framer-motion";
import { useSlauth } from "../hooks/useSlauth";
import { SlauthAuthForm } from "./SlauthAuthForm";
import { OAuthButton } from "./OAuthButton";
import { OAuthProviderKey } from "../config/oauthProviders";
import { defaultTheme, ThemeConfig } from "../config/defaultTheme";

export interface SlauthModalProps {
  baseUrl: string;
  onLoginSuccess?: (token: string) => void;
  oauthProviders?: OAuthProviderKey[];
  useThemedIcons?: boolean;
  /** Override colors; falls back to `defaultTheme` */
  theme?: ThemeConfig;
}

export const SlauthModal = ({
  baseUrl,
  onLoginSuccess,
  oauthProviders = [],
  useThemedIcons = false,
  theme = defaultTheme,
}: SlauthModalProps) => {
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
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 font-sans"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div
          className="p-8 rounded-2xl shadow-xl w-[24rem] transition-all"
          style={{ backgroundColor: theme.background, color: theme.text }}
        >
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

          {oauthProviders.length > 0 && (
            <div
            className={
              `m-4 ${oauthProviders.length > 4 ? 
              "grid grid-cols-3 gap-2 place-items-center" : 
              "space-y-2"
              }`}
            >
              {oauthProviders.map((provider) => (
                <OAuthButton
                  key={provider}
                  provider={provider}
                  baseUrl={baseUrl}
                  useThemedIcons={useThemedIcons}
                  iconOnly={oauthProviders.length > 4}
                />
              ))}
              {oauthProviders.length <= 4 && (
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2" style={{ backgroundColor: theme.background, color: theme.text }}>
                      or
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-4 text-sm">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              onClick={toggleMode}
              className="font-medium hover:underline"
              style={{ color: theme.accent }}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
