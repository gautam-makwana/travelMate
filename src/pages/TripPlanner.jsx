import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTripContext } from "../context/TripContext";
import confetti from "canvas-confetti";

export default function TripPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTripPlanned } = useTripContext(); // Access the context setter

  const {
    mood,
    destination,
    travelType: preSelectedType,
  } = location.state || {};

  const [duration, setDuration] = useState("3 Days");
  const [budget, setBudget] = useState("Medium");
  const [travelType, setTravelType] = useState(preSelectedType || "Couple");

  const durations = ["2 Days", "3 Days", "5 Days", "7 Days"];
  const budgets = ["Low", "Medium", "High"];
  const types = ["Solo", "Couple", "Family", "Friends"];

  // Framer Motion variants for staggered animations
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        delay: 0.5,
        staggerChildren: 0.15, // Stagger the appearance of each option group
      },
    },
  };

  const groupVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  
  // Custom variants for the attractive button hover effects
  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.05,
      y: -5, // A subtle lift effect
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)", // Purple glow
      transition: { type: "spring", stiffness: 200, damping: 10 }
    },
    active: {
      scale: 0.95,
      boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  // Launch the confetti animation
  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#8B5CF6", "#EC4899", "#22D3EE"],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    launchConfetti();

    setTimeout(() => {
      setTripPlanned(true);
      navigate("/trip-summary", {
        state: { mood, destination, duration, budget, travelType },
      });
    }, 1200);
  };

  return (
    <>
      <style>{`
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0a0a0a, #1a1a1a);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }

        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <div className="min-h-screen flex flex-col text-white animated-gradient-bg relative overflow-hidden font-sans">
        <Navbar />
        
        <section className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
          <div className="max-w-4xl w-full">
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
              className="text-5xl md:text-6xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 drop-shadow-lg"
            >
              Let's Plan Your <span className="italic font-light">{mood}</span> Trip
            </motion.h2>

            {destination && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-12 text-lg text-center text-gray-300 font-light"
              >
                Destination:{" "}
                <span className="font-semibold text-emerald-400">
                  {destination.name}
                </span>
              </motion.p>
            )}

            <motion.form
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="show"
              className="grid gap-12 bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10"
            >
              {/* Duration Section */}
              <motion.div variants={groupVariants}>
                <label className="block mb-6 text-2xl font-bold text-gray-200 flex items-center gap-3">
                  <span className="text-3xl">📅</span> Trip Duration
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {durations.map((d) => (
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="active"
                      type="button"
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`p-5 rounded-2xl transition-all duration-300 font-medium text-lg border-2 ${
                        duration === d
                          ? "bg-fuchsia-600 text-white border-fuchsia-400 shadow-md shadow-fuchsia-500/30"
                          : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {d}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Budget Section */}
              <motion.div variants={groupVariants}>
                <label className="block mb-6 text-2xl font-bold text-gray-200 flex items-center gap-3">
                  <span className="text-3xl">💰</span> Budget
                </label>
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  {budgets.map((b) => (
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="active"
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`p-5 rounded-2xl transition-all duration-300 font-medium text-lg border-2 ${
                        budget === b
                          ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30"
                          : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {b}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Travel Type Section */}
              {!preSelectedType && (
                <motion.div variants={groupVariants}>
                  <label className="block mb-6 text-2xl font-bold text-gray-200 flex items-center gap-3">
                    <span className="text-3xl">👥</span> Travel Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {types.map((t) => (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="active"
                        type="button"
                        key={t}
                        onClick={() => setTravelType(t)}
                        className={`p-5 rounded-2xl transition-all duration-300 font-medium text-lg border-2 ${
                          travelType === t
                            ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30"
                            : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 255, 127, 0.8)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-6 px-6 py-4 rounded-full font-bold text-xl
                           bg-gradient-to-r from-blue-500 to-emerald-500
                           shadow-2xl transition-all duration-300 text-white
                           uppercase tracking-wide"
              >
                Generate Trip Plan 🚀
              </motion.button>
            </motion.form>
          </div>
        </section>
      </div>
    </>
  );
}
