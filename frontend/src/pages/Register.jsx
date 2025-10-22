import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../redux/Auth/authSlice";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleRegister = (e) => {
        e.preventDefault();
        dispatch(registerAdmin({ name, email, password })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                alert("Registration successful! Please login.");
                window.location.href = "/login";
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
            <div className="w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="text-gray-300 text-sm">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

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
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <a href="/login" className="text-purple-500 hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
