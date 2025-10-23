import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Projects from "../pages/Project";
import EventTimeline from "../pages/EventTimeline"; // Add this

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/project" element={<Projects />} />
      <Route path="/project/:projectId/timeline" element={<EventTimeline />} /> {/* Add this */}
    </Routes>
  );
};

export default AppRoutes;