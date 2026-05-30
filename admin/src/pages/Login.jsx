import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { setToken } from "../redux/slices/authSlice";

// Framer Motion & React Icons
import { motion } from "motion/react";
import { FaArrowRight, FaSpinner } from "react-icons/fa6";
import { FiMail, FiLock, FiShield } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for UX

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent spam clicking

    setIsLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/admin/login`, {
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans">
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10"
      >
        {/* Header Admin Shield Icon & Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <FiShield size={22} className="text-emerald-400" />{" "}
            {/* Admin Touch */}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
            Login to Admin Panel
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Secure workspace. Authorized access only.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={loginHandler} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FiMail size={18} />
            </span>
            <input
              type="email"
              placeholder="Admin Email"
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
              placeholder="Enter Password"
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
            className="w-full bg-black hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-black/10 mt-6 text-sm disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Secure Login</span>
                <FaArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        {/* Safety Disclaimer Footer */}
        <div className="text-center mt-8 text-xs text-slate-400 tracking-wide">
          Protected by end-to-end encryption.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
