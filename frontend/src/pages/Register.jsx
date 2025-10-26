import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../redux/Auth/authSlice";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden px-4 py-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59,130,246,0.1) 35px, rgba(59,130,246,0.1) 70px)`,
                }}></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10 w-full max-w-[320px] xs:max-w-[380px] sm:max-w-md">
                {/* Logo and Company Name */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        MAGADHA <span className="text-blue-400 block sm:inline">ENTERPRISES</span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm">Construction & Real Estate Excellence</p>
                </div>

                {/* Register Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 p-6 sm:p-8">
                    {/* Admin Portal Badge */}
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Admin Registration</span>
                        </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-1 sm:mb-2">Create Account</h2>
                    <p className="text-gray-400 text-center text-xs sm:text-sm mb-6 sm:mb-8">Join as an administrator</p>

                    <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="text-gray-300 text-xs sm:text-sm font-medium flex items-center mb-1.5 sm:mb-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                />
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="text-gray-300 text-xs sm:text-sm font-medium flex items-center mb-1.5 sm:mb-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                </svg>
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="admin@magadha.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                />
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-gray-300 text-xs sm:text-sm font-medium flex items-center mb-1.5 sm:mb-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-9 sm:pr-11 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                />
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                </svg>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-gray-500 text-xs mt-1.5">Must be at least 8 characters</p>
                        </div>

                        {/* Terms and Conditions
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-800" 
              />
              <label className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-400">
                I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms and Conditions</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
              </label>
            </div> */}

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Create Account
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </span>
                            )}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start sm:items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-2.5 sm:p-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-xs sm:text-sm">{error}</p>
                            </div>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-xs sm:text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;