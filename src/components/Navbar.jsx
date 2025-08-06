import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          TravelMate
        </motion.h1>

        <div className="space-x-6 flex">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to="/login"
              className="text-gray-300 hover:text-cyan-400 transition font-medium"
            >
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold shadow-md hover:from-purple-500 hover:to-cyan-400 transition"
            >
              Register
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
