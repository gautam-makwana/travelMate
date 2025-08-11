import React from "react";
import { motion, useAnimation } from "framer-motion";
import Navbar from "./components/Navbar"; // Importing the provided Navbar component
import "./index.css";

const AnimatedLine = ({ className }) => (
  <motion.div
    initial={{ width: 0 }}
    whileInView={{ width: "100%" }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    className={`h-[2px] bg-gradient-to-r from-blue-400 to-emerald-400 ${className}`}
  />
);

const FeatureCard = ({ icon, title, desc, index }) => {
  const controls = useAnimation();
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: index * 0.2 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 255, 127, 0.2)",
      borderColor: "rgba(0, 255, 127, 0.8)",
      rotateX: 2,
      rotateY: 1,
      transition: { duration: 0.2 },
    },
  };

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
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.5 }}
      className="relative p-6 sm:p-8 rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm group cursor-pointer"
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
    >
      <motion.div
        variants={gradientVariants}
        initial="rest"
        animate={controls}
        className="absolute inset-0 bg-gradient-to-t from-blue-400 to-emerald-400 opacity-20 blur-xl"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="text-5xl sm:text-6xl mb-4 sm:mb-6 p-3 sm:p-4 rounded-full bg-black/30 border border-white/20"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <h4 className="text-xl sm:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          {title}
        </h4>
        <p className="text-gray-400 text-sm sm:text-base max-w-xs">{desc}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const features = [
    {
      icon: "🌌",
      title: "Galactic Discovery",
      desc: "Our AI maps out breathtaking destinations based on your unique travel profile.",
    },
    {
      icon: "🚀",
      title: "Intelligent Itineraries",
      desc: "Build dynamic, self-optimizing schedules that adapt to your preferences in real-time.",
    },
    {
      icon: "🌠",
      title: "Real-Time Connections",
      desc: "A stunning visualizer lets you see and track your group's journey on an interactive map.",
    },
    {
      icon: "🛰️",
      title: "Orbital Packing",
      desc: "Get personalized packing suggestions powered by weather, activity, and destination data.",
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="animated-gradient-bg relative min-h-screen text-gray-200">
      <Navbar /> {/* Using the imported Navbar component */}
      <section className="relative overflow-hidden flex items-center justify-center p-4">
        <div className="relative z-20 flex flex-col items-center justify-center h-full min-h-screen text-center px-4 md:px-6">
          <motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight whitespace-nowrap bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,255,127,0.5)]"
            >
              Ignite Your Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-6 sm:mt-8 max-w-xl md:max-w-3xl text-base sm:text-xl md:text-2xl text-gray-200 mx-auto"
            >
              Unlock a new dimension of travel with our AI-powered cosmic
              planner. Navigate the world with intelligence, creativity, and a
              touch of magic.
            </motion.p>
          </motion.div>
        </div>
      </section>
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={textReveal} className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 text-gray-200">
              Explore Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Universe
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl md:max-w-3xl mx-auto mb-10 sm:mb-16">
              A suite of tools designed to elevate your travel experience from
              ordinary to extraordinary.
            </p>
          </motion.div>
          <AnimatedLine className="max-w-xs sm:max-w-sm md:max-w-2xl mx-auto mb-10 sm:mb-16" />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-7xl mx-auto">
            {features.map((f, idx) => (
              <FeatureCard key={idx} {...f} index={idx} />
            ))}
          </div>
        </motion.div>
      </section>
      <section
        id="contact"
        className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-md sm:max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 sm:mb-6"
          >
            Ready to Travel Beyond?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10"
          >
            Join the new era of exploration. Your next adventure is waiting.
          </motion.p>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 30px rgba(0, 255, 127, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.location.href = "/travel-type";
            }}
            className="px-12 py-5 rounded-full text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-2xl transition-all duration-300"
          >
            Launch My Trip 🚀
          </motion.button>
        </div>
      </section>
      <footer className="border-t border-white/10 py-4 sm:py-6">
        <div className="flex justify-center space-x-4 sm:space-x-6 text-gray-400 mb-2 sm:mb-4">
          {["🌐", "🐦", "📸", "💼"].map((icon, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.5, rotate: 15, color: "#4DD0E1" }}
              transition={{ type: "spring", stiffness: 300, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="cursor-pointer text-xl sm:text-2xl"
            >
              {icon}
            </motion.span>
          ))}
        </div>
        <p className="text-center text-gray-500 text-xs sm:text-base">
          © {new Date().getFullYear()} TravelMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}