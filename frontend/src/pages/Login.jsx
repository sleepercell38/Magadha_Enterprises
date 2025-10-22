import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../redux/Auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        window.location.href = "/profile";
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account? <a href="/register" className="text-purple-500 hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
