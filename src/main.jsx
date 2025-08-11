import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import TravelType from "./pages/TravelType";
import MoodSelection from "./pages/MoodSelection";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripPlanner from "./pages/TripPlanner";
import TripSummary from "./pages/TripSummary";
import TripJournal from "./pages/TripJournal";
import { TripProvider } from "./context/TripContext"; 
import GroupTools from "./pages/GroupTools";
// import LiveTracker from "./pages/LiveTracker";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TripProvider> {/* ✅ Wrap everything here */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/travel-type" element={<TravelType />} />
          <Route path="/mood" element={<MoodSelection />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/trip-summary" element={<TripSummary />} />
          <Route path="/trip-journal" element={<TripJournal />} />
          <Route path="/group-tools" element={<GroupTools />} />
          {/* <Route path="/live-tracker" element={<LiveTracker />} /> */}
        </Routes>
      </Router>
    </TripProvider>
  </React.StrictMode>
);
