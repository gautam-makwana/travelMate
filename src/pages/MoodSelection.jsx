import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      <section className="flex-grow flex flex-col items-center px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-12 
                     bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                     bg-clip-text text-transparent text-center"
        >
          Choose Your Mood 🌍
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl w-full">
          {moods.map((mood, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/results", { state: { mood: mood.name } })}
              className={`cursor-pointer ${mood.color} backdrop-blur-xl 
                          rounded-2xl shadow-lg p-10 flex flex-col 
                          items-center justify-center text-center 
                          border border-white/20 hover:border-cyan-400 transition`}
            >
              <span className="text-6xl mb-4">{mood.emoji}</span>
              <h3 className="text-2xl font-bold">{mood.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
