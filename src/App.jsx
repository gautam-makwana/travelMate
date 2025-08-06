import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🌍",
      title: "Mood-Based Destinations",
      desc: "Discover trips perfectly matched to your current vibe.",
    },
    {
      icon: "🧳",
      title: "Smart Packing",
      desc: "Weather-aware packing suggestions for stress-free travel.",
    },
    {
      icon: "👥",
      title: "Group Tracking",
      desc: "Stay connected with friends in real-time while exploring.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col justify-center items-center text-center px-6 h-screen"
      >
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight
           bg-gradient-to-r from-purple-400 via-violet-700 to-gray-900
           bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"


        >
          Plan Smarter, Travel Happier 🌎
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-gray-300"
        >
          AI-powered trip planner with mood-based destinations, live group
          tracking, and intelligent packing.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(34,211,238,0.8)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/travel-type")}
          className="mt-10 px-10 py-4 rounded-full text-lg font-semibold
                     bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500
                     hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400
                     shadow-lg transition duration-300"
        >
          Get Started 🚀
        </motion.button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-black/20 backdrop-blur-lg">
        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Why Choose <span className="text-cyan-400">TravelMate</span>?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.3 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="p-8 bg-white/10 rounded-2xl shadow-xl border border-white/20
                         backdrop-blur-lg text-center"
            >
              <div className="text-6xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-bold mb-2">{f.title}</h4>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-6 mt-auto">
        <div className="flex justify-center space-x-6 text-gray-400">
          {["🌐", "🐦", "📸", "💼"].map((icon, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="cursor-pointer text-2xl hover:text-cyan-400 transition"
            >
              {icon}
            </motion.span>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">
          © {new Date().getFullYear()} TravelMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
