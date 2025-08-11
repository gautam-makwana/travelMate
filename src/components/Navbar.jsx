import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import { Menu, X } from "lucide-react"; // Using lucide-react for icons

// Variants for the mobile menu animations
const menuVariants = {
  hidden: {
    y: "-100%",
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
  visible: {
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Variants for the menu links
const linkVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

// A custom wrapper for our links to apply animations
const MotionLink = ({ to, children, className, ...rest }) => (
  <motion.div variants={linkVariants} whileHover={{ scale: 1.05 }}>
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  </motion.div>
);

export default function Navbar() {
  const { tripPlanned } = useTripContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Brand with motion animation */}
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent cursor-pointer"
        >
          <Link to="/">TravelMate</Link>
        </motion.h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {tripPlanned && (
            <MotionLink
              to="/trip-journal"
              className="relative text-gray-300 hover:text-white font-medium transition-all duration-300 group"
            >
              Trip Journal 📖
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </MotionLink>
          )}

          <MotionLink
            to="/login"
            className="relative text-gray-300 hover:text-white font-medium transition-all duration-300 group"
          >
            Login
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </MotionLink>

          {/* Register Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 text-black font-semibold shadow-md transition-all duration-300 hover:scale-105"
            >
              Register
            </Link>
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none p-2 rounded-md"
          >
            {isMenuOpen ? (
              <X size={28} className="text-white" />
            ) : (
              <Menu size={28} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden fixed top-[69px] left-0 right-0 h-auto bg-black/90 backdrop-blur-lg border-b border-white/10 shadow-lg p-6 flex flex-col items-center space-y-6"
          >
            {tripPlanned && (
              <MotionLink
                to="/trip-journal"
                className="text-gray-200 text-lg font-medium hover:text-emerald-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Trip Journal 📖
              </MotionLink>
            )}

            <MotionLink
              to="/login"
              className="text-gray-200 text-lg font-medium hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </MotionLink>

            <motion.div variants={linkVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="w-full text-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 text-black font-semibold shadow-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}