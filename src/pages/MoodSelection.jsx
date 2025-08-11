import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

// A dedicated component for each mood card to keep the code clean
const MoodCard = ({ mood, navigate, index }) => {
  return (
    <motion.div
      key={mood.name}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25, // Faster initial transition
        ease: "easeOut",
        delay: index * 0.05, // Shorter stagger delay
      }}
      whileHover={{
        scale: 1.05,
        y: -15, // More pronounced lift
        boxShadow: "0 25px 60px rgba(0, 255, 127, 0.6), 0 0 15px rgba(74, 222, 128, 0.9)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/results", { state: { mood: mood.name } })}
      className={`relative cursor-pointer rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center
                 bg-black/20 backdrop-blur-xl border border-white/20 overflow-hidden
                 transition-all duration-200 transform-gpu perspective-1000 // Faster overall hover transition
                 hover:border-emerald-400/80`}
    >
      {/* Dynamic gradient overlay that appears on hover */}
      <motion.div
        className={`absolute inset-0 z-0 opacity-0 transition-opacity duration-300
                    bg-gradient-to-br from-blue-500/20 to-emerald-500/20`}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }} // Faster overlay transition
      />
      <div className="relative z-10 flex flex-col items-center">
        <motion.span 
          className="text-6xl sm:text-7xl mb-4 sm:mb-6"
          whileHover={{ scale: 1.2, rotate: 360 }} // New emoji spin effect on hover
          transition={{ duration: 0.4 }} // Faster emoji spin
        >
          {mood.emoji}
        </motion.span>
        <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent
                       bg-gradient-to-r from-gray-200 to-white">
          {mood.name}
        </h3>
      </div>
    </motion.div>
  );
};

export default function MoodSelection() {
  const navigate = useNavigate();

  const moods = [
    { name: "Relaxed", emoji: "🌿", color: "bg-green-500/30" },
    { name: "Adventurous", emoji: "🧗", color: "bg-orange-500/30" },
    { name: "Romantic", emoji: "❤️", color: "bg-pink-500/30" },
    { name: "Cultural & Heritage", emoji: "🕌", color: "bg-yellow-500/30" },
    { name: "Party", emoji: "🎉", color: "bg-purple-500/30" },
    { name: "Flower-Valleys", emoji: "🌸", color: "bg-rose-500/30" },
  ];

  return (
    <div className="min-h-screen flex flex-col text-white animated-gradient-bg">
      <Navbar />
      <section className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} // Faster title animation
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 sm:mb-16 
                      bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                      bg-clip-text text-transparent text-center drop-shadow-md"
        >
          Choose Your Vibe 🪐
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl w-full"
        >
          {moods.map((mood, idx) => (
            <MoodCard key={mood.name} mood={mood} navigate={navigate} index={idx} />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
