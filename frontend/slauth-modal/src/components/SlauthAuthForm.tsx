import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface Props {
  isSignup: boolean;
  error: string | null;
  isLoading: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onSubmit: () => void;
}

export const SlauthAuthForm = ({
  isSignup,
  error,
  isLoading,
  email,
  password,
  confirmPassword,
  setEmail,
  setPassword,
  setConfirmPassword,
  onSubmit
}: Props) => {
  const controls = useAnimation();

  useEffect(() => {
    if (error) {
      controls.start({
        x: [0, -10, 10, -6, 6, -2, 2, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && password !== confirmPassword) return;
    onSubmit();
  };

  const passwordsMismatch = isSignup && password && confirmPassword && password !== confirmPassword;

  return (
    <motion.form onSubmit={handleSubmit} className="overflow-hidden" animate={controls}>
      <label className="block text-sm font-medium mb-1" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="relative border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="block text-sm font-medium mb-1" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        className="relative border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {isSignup && (
        <>
          <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            className="relative border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {passwordsMismatch && (
        <p className="text-red-500 text-sm mb-2">Passwords do not match</p>
      )}

      <button
        disabled={isLoading || passwordsMismatch}
        type="submit"
        className={`${isLoading || passwordsMismatch
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-sloth-green hover:bg-green-600"
          } text-white font-semibold p-2 w-full rounded transition-all`}
      >
        {isLoading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
      </button>
    </motion.form>
  );
};
