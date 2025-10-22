import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logoutAdmin } from "../redux/Auth/authSlice";
import Navbar from "../components/Navbar";

const Profile = () => {
  const dispatch = useDispatch();
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

  if (loading) return <p className="text-white text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <Navbar username={admin?.name} onLogout={handleLogout} />
    </div>
  );
};

export default Profile;
