import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile, logoutAdmin } from "../redux/Auth/authSlice";
import { fetchProjects } from "../redux/Project/projectSlice"; // Add this import
import Navbar from "../components/Navbar";
import Projects from "./Project";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, token, loading, error } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.project); // Add this selector

  // Calculate project statistics
  const activeProjects = projects.filter(project => project.status === "active").length;
  const completedProjects = projects.filter(project => project.status === "completed").length;
  const totalProjects = projects.length;

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    dispatch(fetchProfile());
    dispatch(fetchProjects(token)); 
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

            {/* Stats Grid - Now with Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {/* Active Projects - Real Data */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {activeProjects}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Active Projects</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {activeProjects > 0 ? "Currently in progress" : "No active projects"}
                </p>
              </div>

              {/* Completed Projects - Real Data */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {completedProjects}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Completed Projects</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {completedProjects > 0 ? "Successfully delivered" : "No completed projects"}
                </p>
              </div>

              {/* Total Projects - Real Data */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {totalProjects}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
                <p className="text-xs text-gray-500 mt-1">
                  All time projects
                </p>
              </div>

              {/* Success Rate - Calculated */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {totalProjects > 0 ? `${Math.round((completedProjects / totalProjects) * 100)}%` : '0%'}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Success Rate</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalProjects > 0
                    ? `${completedProjects} of ${totalProjects} completed`
                    : "No projects yet"
                  }
                </p>
              </div>
            </div>

            {/* Project Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Active Projects Detail */}
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Active Projects</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">In Progress</span>
                    <span className="text-2xl font-bold text-blue-400">{activeProjects}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {totalProjects > 0
                      ? `${Math.round((activeProjects / totalProjects) * 100)}% of total projects`
                      : "Start your first project"
                    }
                  </p>
                </div>
              </div>

              {/* Completed Projects Detail */}
              <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Completed Projects</h3>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-400 text-sm">Done</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Delivered</span>
                    <span className="text-2xl font-bold text-green-400">{completedProjects}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {completedProjects > 0
                      ? "Great job on completing these projects!"
                      : "Complete your first project"
                    }
                  </p>
                </div>
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