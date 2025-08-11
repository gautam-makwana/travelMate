// src/pages/LiveTracker.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import L from "leaflet";
import "../utils/leafletConfig"; // Adjust the path if needed


// Custom icon
const memberIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [32, 32],
});

// Mock data for group members
const groupMembers = [
  { name: "Ravi", lat: 28.6139, lon: 77.209 },
  { name: "Sneha", lat: 28.609, lon: 77.215 },
  { name: "Amit", lat: 28.617, lon: 77.198 },
  { name: "Priya", lat: 28.6205, lon: 77.2107 },
];

export default function LiveTracker() {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]);

  useEffect(() => {
    if (groupMembers.length > 0) {
      const avgLat =
        groupMembers.reduce((sum, member) => sum + member.lat, 0) /
        groupMembers.length;
      const avgLon =
        groupMembers.reduce((sum, member) => sum + member.lon, 0) /
        groupMembers.length;
      setMapCenter([avgLat, avgLon]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Navbar />
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-10 text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          🛰️ Live Group Trip Tracker
        </motion.h2>

        <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
          <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {groupMembers.map((member, idx) => (
              <Marker
                key={idx}
                position={[member.lat, member.lon]}
                icon={memberIcon}
              >
                <Popup>
                  <strong>{member.name}</strong><br />
                  Sharing live location 📍
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
