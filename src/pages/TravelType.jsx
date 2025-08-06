import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function TravelType() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const travelOptions = [
    { type: "Solo", icon: "🧍", desc: "Plan your solo adventure with smart recommendations." },
    { type: "Group", icon: "👥", desc: "Plan and coordinate with your friends in real time." },
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setTimeout(() => navigate("/mood"), 800); // auto move after selection
  };

  return (
    <>
      <Navbar />
    
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>

      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-10 
                   bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                   bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
      >
        Choose Your Travel Type ✈️
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {travelOptions.map((option, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option.type)}
            className={`cursor-pointer p-8 rounded-2xl shadow-xl text-center 
                        backdrop-blur-lg border transition-all duration-300
                        ${selected === option.type 
                          ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white shadow-2xl"
                          : "bg-white/10 border-white/20 text-white hover:border-cyan-400"
                        }`}
          >
            <div className="text-6xl mb-4">{option.icon}</div>
            <h3 className="text-2xl font-semibold">{option.type}</h3>
            <p className="text-gray-300 mt-3">{option.desc}</p>
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-lg font-medium text-gray-200 drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]"
        >
          You selected <span className="text-cyan-400">{selected}</span>! Preparing your trip...
        </motion.p>
      )}
    </div>
</>
  );
}
