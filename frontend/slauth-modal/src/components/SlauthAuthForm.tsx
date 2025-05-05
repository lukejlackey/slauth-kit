import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // or your preferred icon library

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const passwordChecks = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "Contains a number", test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: "Contains an uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "Contains a special character", test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  const allPasswordChecksPass = passwordChecks.every(({ test }) => test(password));

  const passwordsMismatch = isSignup && (confirmPassword === "" || password !== confirmPassword);

  const renderPasswordField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (b: boolean) => void
  ) => (
    <div className="relative mb-3">
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full pr-10 focus:outline-none focus:ring focus:ring-sloth-green"
        type={show ? "text" : "password"}
        placeholder="********"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-[38px] text-gray-500 hover:text-gray-700"
        tabIndex={-1}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <motion.form onSubmit={handleSubmit} className="overflow-hidden" animate={controls}>
      <label className="block text-sm font-medium mb-1" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="border border-neutral-300 bg-white text-sloth-text p-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-sloth-green"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {renderPasswordField("password", "Password", password, setPassword, showPassword, setShowPassword)}

      {isSignup && (
        <ul className="text-sm mb-2 ml-1">
          {passwordChecks.map(({ label, test }) => (
            <li key={label} className={test(password) ? "text-green-600" : "text-gray-500"}>✔ {label}</li>
          ))}
        </ul>
      )}

      {isSignup &&
        renderPasswordField("confirm-password", "Confirm Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm)}
      
      {isSignup && (
        <ul className="text-sm mb-2 ml-1">
          <li className={password && confirmPassword && !passwordsMismatch ? "text-green-600" : "text-gray-500"}>
            ✔ Passwords match
          </li>
        </ul>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        disabled={
          isLoading ||
          (isSignup && (!allPasswordChecksPass || passwordsMismatch))
        }
        type="submit"
        className={`${isLoading ||
          (isSignup && (!allPasswordChecksPass || passwordsMismatch))
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-sloth-green hover:bg-green-600"
          } text-white font-semibold p-2 w-full rounded transition-all`}
      >
        {isLoading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
      </button>

    </motion.form>
  );
};