import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setToken } from "../redux/slices/userSlice";
import { auth } from "../utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Framer Motion & React Icons
import { motion } from "motion/react";
import { FaGoogle, FaArrowRight, FaSpinner } from "react-icons/fa6";
import { FiMail, FiLock, FiShoppingBag } from "react-icons/fi";
const provider = new GoogleAuthProvider();
const LoginUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response?.data?.success) {
        localStorage.setItem("token", response.data.token);
        dispatch(setToken(response.data.token));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      const response = await axios.post(`${serverUrl}/api/auth/google-login`, {
        token: firebaseToken,
        name: user.displayName,
        email: user.email,
      });
      if (response?.data?.success) {
        localStorage.setItem("token", response.data.token);
        dispatch(setToken(response.data.token));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <FiShoppingBag size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
            Login to Continue Shopping!
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer text-sm mb-6 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-red-500" size={18} />
          <span>Login with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Or login with email
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FiMail size={18} />
            </span>
            <input
              type="email"
              placeholder="Email address"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FiLock size={18} />
            </span>
            <input
              type="password"
              placeholder="Enter password"
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-black/10 mt-2 text-sm disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login Now</span>
                <FaArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => navigate("/register")}
            className="text-black font-semibold hover:underline underline-offset-4 cursor-pointer ml-1 transition-all bg-transparent border-none p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            Signup Here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUser;
