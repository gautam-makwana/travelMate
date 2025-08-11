import React, { useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

// The Navbar component from your landing page, included for a self-contained app.
const Navbar = () => (
  <nav className="fixed w-full top-0 left-0 z-50 p-4 sm:p-6 backdrop-blur-md bg-black/30 border-b border-white/20">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        TravelMate
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6">
        <motion.a
          href="/login"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 127, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="relative px-4 py-2 rounded-full text-white font-semibold transition-all duration-200 border border-transparent hover:border-emerald-400 hover:bg-white/10"
        >
          Login
        </motion.a>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 127, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="relative px-6 py-2 rounded-full font-bold text-white overflow-hidden group transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-300"></span>
          <span className="relative z-10">Register</span>
        </motion.a>
      </div>
    </div>
  </nav>
);

/**
 * A reusable card component for travel options with dynamic hover effects.
 * This version uses the same linear gradient wipe from your landing page's FeatureCard.
 */
const TravelTypeCard = ({ option, idx, selected, handleSelect }) => {
  const controls = useAnimation();
  
  // Animation variants for the card reveal and hover effects
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 255, 127, 0.2)" },
    tap: { scale: 0.98 },
  };

  // Variants for the bottom-to-top linear gradient hover effect,
  // matching the implementation on your landing page.
  const gradientVariants = {
    rest: { y: "100%", opacity: 0 },
    hover: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      key={idx}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={() => handleSelect(option.type)}
      transition={{ delay: idx * 0.2 }}
      className={`relative cursor-pointer p-8 rounded-3xl shadow-xl text-center 
                  backdrop-blur-sm border transition-all duration-300 overflow-hidden
                  ${selected === option.type
                    ? "bg-white/10 border-emerald-400"
                    : "bg-white/5 border-white/10 hover:border-blue-400"
                  }`}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
    >
      {/* Animated linear gradient overlay for the hover effect */}
      <motion.div
        variants={gradientVariants}
        initial="rest"
        animate={controls}
        className="absolute inset-0 bg-gradient-to-t from-blue-400 to-emerald-400 opacity-20 blur-xl"
      />
      
      {/* Card content, placed above the gradient overlay */}
      <div className="relative z-10">
        <div className="text-5xl md:text-6xl mb-4 p-3 rounded-full 
                        bg-black/30 border border-white/20 inline-block">
          {option.icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-white to-gray-300">
          {option.type}
        </h3>
        <p className="text-gray-400 mt-3 text-sm sm:text-base">{option.desc}</p>
      </div>
    </motion.div>
  );
};


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
    // The main container now uses the same animated background class
    // from your landing page for a consistent theme.
    <div className="animated-gradient-bg relative min-h-screen text-gray-200 flex flex-col items-center justify-center p-6">
      <Navbar />
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 md:px-0">
        {/* Main heading with enhanced gradient and animation */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10 text-center
                     bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 
                     bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,255,127,0.5)]"
        >
          Choose Your Travel Type 🚀
        </motion.h2>

        {/* Dynamic grid container for the cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {travelOptions.map((option, idx) => (
            <TravelTypeCard 
              key={idx} 
              option={option} 
              idx={idx} 
              selected={selected} 
              handleSelect={handleSelect} 
            />
          ))}
        </div>

        {/* Confirmation message */}
        {selected && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-lg font-medium text-gray-200 text-center"
          >
            You selected <span className="text-emerald-400 font-bold">{selected}</span>! Preparing your next cosmic journey...
          </motion.p>
        )}
      </div>
    </div>
  );
}
