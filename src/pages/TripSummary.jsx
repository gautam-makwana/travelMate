import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import "../index.css";

// A reusable Card component with an enhanced, dynamic hover effect
const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 transform transition-all duration-300 ${className}`}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 100, delay }}
    whileHover={{
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 0 40px rgba(0, 255, 127, 0.4)", // A vibrant, glowing effect
      transition: { duration: 0.3, ease: "easeInOut" },
    }}
  >
    {children}
  </motion.div>
);

// A reusable MotionButton for consistent, next-level interactive buttons
const MotionButton = ({ children, className, ...props }) => (
  <motion.button
    whileHover={{
      scale: 1.05,
      y: -5, // A subtle lift effect
      boxShadow: "0 0 30px rgba(0, 255, 127, 0.8)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
    }}
    whileTap={{ scale: 0.95 }}
    className={`inline-block px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default function TripSummary() {
  const location = useLocation();
  const { mood, destination, duration, budget, travelType } =
    location.state || {};
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = parseInt(duration) || 3;

  const coords = {
    Kerala: { lat: 9.9312, lon: 76.2673 },
    "Goa (South)": { lat: 15.2719, lon: 73.985 },
    Pondicherry: { lat: 11.9416, lon: 79.8083 },
    Uttarakhand: { lat: 30.0668, lon: 79.0193 },
    Sikkim: { lat: 27.533, lon: 88.5122 },
    Andamans: { lat: 11.6234, lon: 92.7265 },
    Himachal: { lat: 31.1048, lon: 77.1734 },
    Ladakh: { lat: 34.1526, lon: 77.577 },
    "Himachal Pradesh": { lat: 32.2396, lon: 77.1887 },
    Meghalaya: { lat: 25.467, lon: 91.3662 },
    "Arunachal Pradesh": { lat: 27.1004, lon: 93.6167 },
    Udaipur: { lat: 24.5854, lon: 73.7125 },
    Kashmir: { lat: 34.0837, lon: 74.7973 },
    "Manali & Solang": { lat: 32.2396, lon: 77.1887 },
    Darjeeling: { lat: 27.041, lon: 88.2663 },
    Rajasthan: { lat: 26.9124, lon: 75.7873 },
    "Madhya Pradesh": { lat: 23.2599, lon: 77.4126 },
    "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
    "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
    Odisha: { lat: 20.9517, lon: 85.0985 },
    Karnataka: { lat: 15.3173, lon: 75.7139 },
    "West Bengal": { lat: 22.9868, lon: 87.855 },
    Mumbai: { lat: 19.076, lon: 72.8777 },
    Bangalore: { lat: 12.9716, lon: 77.5946 },
    Pune: { lat: 18.5204, lon: 73.8567 },
    Shillong: { lat: 25.5788, lon: 91.8933 },
    "Valley of Flowers, Uttarakhand": { lat: 30.728, lon: 79.605 },
    "Yumthang Valley, Sikkim": { lat: 27.8167, lon: 88.7 },
    "Khajjiar, Himachal Pradesh": { lat: 32.55, lon: 76.0667 },
    "Coorg, Karnataka": { lat: 12.3375, lon: 75.8069 },
    "Auli, Uttarakhand": { lat: 30.5312, lon: 79.5615 },
    "Ooty, Tamil Nadu": { lat: 11.4064, lon: 76.6932 },
  };

  const fallbackPlaces = [
    { name: "Local Market", category: "Shopping", lat: 0, lon: 0 },
    { name: "City Park", category: "Recreation", lat: 0, lon: 0 },
    { name: "Popular Café", category: "Food", lat: 0, lon: 0 },
  ];

  const transportOptions = {
    Low: ["Bus 🚍", "Shared Cab 🚕", "Train 🚆"],
    Medium: ["Train 🚆 (AC)", "Private Cab 🚖", "Flight (Budget) ✈️"],
    High: [
      "Luxury Flight ✈️",
      "Private Car 🚗",
      "Helicopter 🚁 (if available)",
    ],
  };

  const generateItinerary = (days) => {
    const baseActivities = [
      "Local sightseeing 🏜",
      "Cultural experiences 🕌",
      "Food exploration 🍲",
      "Adventure activities 🧷",
      "Relaxation & shopping 💼",
    ];
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      activity: baseActivities[i % baseActivities.length],
    }));
  };

  const itinerary = generateItinerary(days);

  useEffect(() => {
    const fetchNearby = async () => {
      if (!destination?.name || !coords[destination.name]) {
        setNearby(fallbackPlaces);
        setLoading(false);
        return;
      }
      const { lat, lon } = coords[destination.name];
      const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

      try {
        const res = await fetch(
          `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},5000&limit=6&apiKey=${apiKey}`
        );
        const data = await res.json();
        if (data.features?.length) {
          setNearby(
            data.features.map((f) => ({
              name: f.properties.name || "Unnamed Place",
              category: f.properties.categories?.[0] || "Attraction",
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0],
            }))
          );
        } else {
          setNearby(fallbackPlaces);
        }
      } catch (err) {
        console.error("Geoapify error:", err);
        setNearby(fallbackPlaces);
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [destination]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      <div className="min-h-screen text-white animated-gradient-bg relative overflow-hidden font-sans">
        <Navbar />
        <main className="px-6 py-20 max-w-7xl mx-auto text-center relative z-10 space-y-16 md:space-y-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="gap-4 text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-500 drop-shadow-[0_0_20px_rgba(0,255,200,0.7)] leading-[1.2] pb-2"
          >
            Your Trip Summary
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,200,0.7)]"
            >
              🧳
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl font-light"
          >
            Here's a curated overview of your upcoming adventure, tailored to
            your preferences.
          </motion.p>

          {/* User Selections Section */}
          <section>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card delay={0.1}>
                <h3 className="text-xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Destination
                </h3>
                <p className="text-gray-200 text-lg">
                  {destination?.name || "Not selected"}
                </p>
              </Card>
              <Card delay={0.2}>
                <h3 className="text-xl font-bold text-fuchsia-300 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🌍</span> Mood
                </h3>
                <p className="text-gray-200 text-lg">{mood}</p>
              </Card>
              <Card delay={0.3}>
                <h3 className="text-xl font-bold text-violet-300 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🗕</span> Duration
                </h3>
                <p className="text-gray-200 text-lg">{duration}</p>
              </Card>
              <Card delay={0.4}>
                <h3 className="text-xl font-bold text-emerald-300 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💰</span> Budget
                </h3>
                <p className="text-gray-200 text-lg">{budget}</p>
              </Card>
              <Card delay={0.5}>
                <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <span className="text-2xl">👥</span> Travel Type
                </h3>
                <p className="text-gray-200 text-lg">{travelType}</p>
              </Card>
            </motion.div>
          </section>

          <div className="w-full h-px bg-white/10 my-16"></div>

          {/* Recommended Transport Section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-4xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500"
            >
              Recommended Transport 🚆✈️
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              {transportOptions[budget]?.map((option, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.15,
                    rotate: -5,
                    boxShadow: "0 0 20px rgba(74, 222, 128, 0.4)", // Glow effect
                    transition: { type: "spring", stiffness: 400 },
                  }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-lg cursor-pointer transition-all duration-300 hover:bg-white/20"
                >
                  {option}
                </motion.div>
              ))}
            </motion.div>
          </section>

          <div className="w-full h-px bg-white/10 my-16"></div>

          {/* Suggested Itinerary Section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-4xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-600"
            >
              Suggested Itinerary 🗓️
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {itinerary.map((plan, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(236, 72, 153, 0.4)", // Another vibrant glow
                    transition: { duration: 0.3 },
                  }}
                  className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg text-left transform transition-all duration-300"
                >
                  <h4 className="text-2xl font-bold mb-2 text-white/90">
                    Day {plan.day}
                  </h4>
                  <p className="text-gray-300 font-light">{plan.activity}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <div className="w-full h-px bg-white/10 my-16"></div>

          {/* Nearby Attractions Section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-4xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-400"
            >
              Nearby Attractions 🗺️
            </motion.h2>
            {loading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-gray-400 italic text-xl"
              >
                Fetching nearby attractions...
              </motion.p>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {nearby.map((place, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                      boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)", // A glowing purple shadow
                      transition: { type: "spring", stiffness: 200 },
                    }}
                    className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg text-left transform transition-all duration-300"
                  >
                    <h4 className="text-xl font-bold text-white/90">
                      {place.name}
                    </h4>
                    <p className="text-gray-300 font-light text-sm mt-1">
                      {place.category}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-500 font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      View on Map 🗺️
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

          {/* New Button to Group Tools */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.8,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="mt-16"
          >
            <Link
              to="/group-tools"
              state={{ travelType }}
              className="inline-block px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-xl hover:scale-105 transition-all duration-300"
            >
              Open Group Coordination Tools 🛠️
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
}
