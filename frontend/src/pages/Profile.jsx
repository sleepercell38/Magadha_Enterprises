import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile, logoutAdmin } from "../redux/Auth/authSlice";
import Navbar from "../components/Navbar";
import Projects from "./Project";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    dispatch(fetchProfile());
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    window.location.href = "/login";
  };

  const handleViewProjects = () => {
    navigate("/project");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Navbar */}
      <Navbar username={admin?.name} onLogout={handleLogout} />

      {/* Hero Section with Construction Pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59,130,246,0.1) 35px, rgba(59,130,246,0.1) 70px)`,
          }}></div>
        </div>
        
        <div className="relative z-10 px-6 py-12 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Construction & Real Estate Management
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    Welcome back, <span className="text-blue-400">{admin?.name || "Admin"}</span>
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Manage your construction projects and real estate portfolio
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {/* Active Projects */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Active Projects</h3>
                <p className="text-xs text-gray-500 mt-1">3 pending review</p>
              </div>

              {/* Properties */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">48</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Total Properties</h3>
                <p className="text-xs text-gray-500 mt-1">28 residential, 20 commercial</p>
              </div>

              {/* Under Construction */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">7</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Under Construction</h3>
                <p className="text-xs text-gray-500 mt-1">Est. completion Q2 2024</p>
              </div>

              {/* Total Value */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">$24.5M</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Portfolio Value</h3>
                <p className="text-xs text-green-400 mt-1">↑ 12.5% from last month</p>
              </div>
            </div>


            {/* Projects Section */}
            <div className="mt-8">
              <Projects />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;