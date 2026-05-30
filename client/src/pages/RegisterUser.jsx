import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setToken } from "../redux/slices/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Framer Motion & React Icons
import { motion } from "motion/react";
import { FaGoogle, FaArrowRight, FaRegUser, FaSpinner } from "react-icons/fa6";
import { FiMail, FiLock, FiShoppingBag } from "react-icons/fi";
import { auth } from "../utils/firebase";
const provider = new GoogleAuthProvider();

const RegisterUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/register`, {
        username,
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
      toast.error(error?.response?.data?.message || "Registration Failed");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const googleResposne = await signInWithPopup(auth, provider);

      const user = googleResposne.user;
      const name = user.displayName;
      const email = user.email;
      const firebaseToken = await user.getIdToken();

      const response = await axios.post(
        `${serverUrl}/api/auth/google-register`,
        {
          name,
          email,
          token: firebaseToken,
        },
      );

      if (response?.data?.success) {
        localStorage.setItem("token", response.data.token);
        dispatch(setToken(response.data.token));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration Failed");
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
            Register to Continue Shopping!
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Discover the best deals today.
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer text-sm mb-6 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-red-500" size={18} />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Or register with email
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FaRegUser size={16} />
            </span>
            <input
              type="text"
              placeholder="Username"
              disabled={isLoading}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FiLock size={18} />
            </span>
            <input
              type="password"
              placeholder="Create password"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Now</span>
                <FaArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => navigate("/login")}
            className="text-black font-semibold hover:underline underline-offset-4 cursor-pointer ml-1 transition-all bg-transparent border-none p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            Login Here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterUser;
