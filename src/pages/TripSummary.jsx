// src/pages/TripSummary.jsx
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function TripSummary() {
  const location = useLocation();
  const { mood, destination, duration, budget, travelType } =
    location.state || {};
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map duration to number of days
  const days = parseInt(duration) || 3;

  // Coordinates for destinations
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

  // Budget-based transport
  const transportOptions = {
    Low: ["Bus 🚍", "Shared Cab 🚕", "Train 🚆"],
    Medium: ["Train 🚆 (AC)", "Private Cab 🚖", "Flight (Budget) ✈️"],
    High: ["Luxury Flight ✈️", "Private Car 🚗", "Helicopter 🚁 (if available)"],
  };

  // Itinerary generator
  const generateItinerary = (days) => {
    const baseActivities = [
      "Local sightseeing 🏞",
      "Cultural experiences 🕌",
      "Food exploration 🍲",
      "Adventure activities 🧗",
      "Relaxation & shopping 🛍",
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

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      <section className="flex-grow px-6 py-16 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-10 
                     bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                     bg-clip-text text-transparent"
        >
          Your Trip Summary 🎒
        </motion.h2>

        {/* Trip Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20 text-left">
          <p className="mb-4">
            <strong>📍 Destination:</strong> {destination?.name || "Not selected"}
          </p>
          <p className="mb-4">
            <strong>🌍 Mood:</strong> {mood}
          </p>
          <p className="mb-4">
            <strong>📅 Duration:</strong> {duration}
          </p>
          <p className="mb-4">
            <strong>💰 Budget:</strong> {budget}
          </p>
          <p className="mb-4">
            <strong>👥 Travel Type:</strong> {travelType}
          </p>
        </div>

        {/* Transport Options */}
        <h3 className="text-2xl font-bold mt-12 mb-6">Recommended Transport 🚆✈️</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {transportOptions[budget]?.map((option, idx) => (
            <span
              key={idx}
              className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 shadow"
            >
              {option}
            </span>
          ))}
        </div>

        {/* Itinerary */}
        <h3 className="text-2xl font-bold mt-12 mb-6">Suggested Itinerary 📅</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {itinerary.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 rounded-xl p-6 shadow-lg text-left"
            >
              <h4 className="text-xl font-semibold">Day {plan.day}</h4>
              <p className="text-gray-300">{plan.activity}</p>
            </motion.div>
          ))}
        </div>

        {/* Nearby Attractions */}
        <h3 className="text-2xl font-bold mt-12 mb-6">Nearby Attractions 🏞</h3>
        {loading ? (
          <p className="text-gray-300">Fetching nearby attractions...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {nearby.map((place, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 rounded-xl p-6 shadow-lg text-left"
              >
                <h4 className="text-xl font-semibold">{place.name}</h4>
                <p className="text-gray-300">{place.category}</p>
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white font-semibold"
                >
                  View on Map 🗺
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
