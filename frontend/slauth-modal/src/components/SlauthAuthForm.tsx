import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  isSignup: boolean;
  error: string | null;
  isLoading: boolean;
  onSubmit: (email: string, password: string) => void;
}

export const SlauthAuthForm = ({ isSignup, error, isLoading, onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden">
      <label className="block text-sm font-medium mb-1" htmlFor="email">
        Email
      </label>
      <motion.input
        animate={controls}
        id="email"
        className="border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="block text-sm font-medium mb-1" htmlFor="password">
        Password
      </label>
      <motion.input
        animate={controls}
        id="password"
        className="border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        disabled={isLoading}
        type="submit"
        className={`${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-sloth-green hover:bg-green-600"
          } text-white font-semibold p-2 w-full rounded transition-all`}
      >
        {isLoading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
      </button>

    </form>
  );
};
