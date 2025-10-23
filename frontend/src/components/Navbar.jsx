import React from "react";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="w-full bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-semibold text-white">
        Magadha Enterprices
      </div>
      <button
        onClick={onLogout}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
