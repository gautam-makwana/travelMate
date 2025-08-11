import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  KeyRound,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-white" />,
    error: <XCircle className="h-5 w-5 text-white" />,
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-full shadow-lg z-50 flex items-center gap-3 font-semibold text-sm text-white",
            colors[type]
          )}
        >
          {icons[type]}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Login({ onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setToast({ message: "Login successful!", type: "success" });
        setUsername("");
        setPassword("");
      }, 2000);
    } else {
      setToast({
        message: "Please fix the errors in the form.",
        type: "error",
      });
    }
  };

  return (
    <>
      <style>
        {`
          .animated-gradient-bg {
            background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0a0a0a, #1a1a1a);
            background-size: 400% 400%;
            animation: gradient-animation 15s ease infinite;
          }
          @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="min-h-screen animated-gradient-bg text-white font-sans flex flex-col relative overflow-hidden">
        <section className="flex-grow flex items-center justify-center px-4 md:px-6 py-12 relative z-10">
          <motion.div
            className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-3xl shadow-2xl border border-white/10 relative z-10"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div className="flex flex-col items-center mb-8">
              <motion.div
                variants={itemVariants}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <KeyRound className="h-16 w-16 mb-4 text-blue-400 drop-shadow-lg" />
              </motion.div>
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 text-transparent bg-clip-text"
                variants={itemVariants}
              >
                Sign In
              </motion.h2>
              <motion.p className="text-gray-300 mt-2" variants={itemVariants}>
                Access your dashboard
              </motion.p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={itemVariants}
            >
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={validateForm}
                  placeholder="Username"
                  className={cn(
                    "w-full px-12 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300",
                    errors.username
                      ? "ring-red-500 border border-red-500"
                      : "ring-transparent focus:ring-blue-400 border border-transparent focus:border-blue-400"
                  )}
                />
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-xs text-red-400"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validateForm}
                  placeholder="Password"
                  className={cn(
                    "w-full px-12 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300",
                    errors.password
                      ? "ring-red-500 border border-red-500"
                      : "ring-transparent focus:ring-teal-400 border border-transparent focus:border-teal-400"
                  )}
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-xs text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 255, 127, 0.8)",
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-300 transform-gpu",
                  loading
                    ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-[0_0_25px_rgba(129,140,248,0.5)]"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Signing In...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center text-sm space-y-2"
            >
              <button
                onClick={() => onNavigate("forgot")}
                className="block text-gray-300 hover:text-blue-400 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")} // ⬅️ Navigate to register page
                  className="text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          </motion.div>
        </section>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      </div>
    </>
  );
}
