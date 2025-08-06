// src/pages/TripPlanner.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function TripPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mood, destination, travelType } = location.state || {}; // get travelType from previous step

  const [duration, setDuration] = useState("3 Days");
  const [budget, setBudget] = useState("Medium");

  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      <section className="flex-grow px-6 py-16 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-10 
                     bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                     bg-clip-text text-transparent"
        >
          Plan Your {mood} Trip ✈️
        </motion.h2>

        {destination && (
          <p className="mb-8 text-lg text-gray-300">
            You selected <span className="font-bold">{destination.name}</span>  
            {travelType && ` as a ${travelType} trip`}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/trip-summary", {
              state: { mood, destination, duration, budget, travelType },
            });
          }}
          className="space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20"
        >
          <div>
            <label className="block text-left mb-2 font-semibold">📅 Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option>2 Days</option>
              <option>3 Days</option>
              <option>5 Days</option>
              <option>7 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-left mb-2 font-semibold">💰 Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-6 py-3 rounded-full font-semibold 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 
                       shadow-lg transition duration-300"
          >
            Generate Trip Plan 🚀
          </motion.button>
        </form>
      </section>
    </div>
  );
}
