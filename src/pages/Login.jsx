import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-black to-violet-500 bg-clip-text text-transparent mb-6">
          Login to TravelMate
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-gray-900 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="********"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold shadow-lg"
          >
            Login
          </motion.button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
