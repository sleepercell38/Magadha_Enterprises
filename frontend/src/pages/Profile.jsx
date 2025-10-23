import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile, logoutAdmin } from "../redux/Auth/authSlice";
import Navbar from "../components/Navbar";

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
    return <p className="text-white text-center mt-8">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <Navbar username={admin?.name} onLogout={handleLogout} />

      <div className="flex flex-col items-center justify-center mt-24">
        <h1 className="text-3xl font-semibold mb-4">
          Welcome, {admin?.name || "Admin"}
        </h1>
  

        <button
          onClick={handleViewProjects}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
        >
          View Projects
        </button>
      </div>
    </div>
  );
};

export default Profile;
