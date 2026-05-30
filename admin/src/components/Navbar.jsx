import { useDispatch } from "react-redux";
import { setToken } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

// Premium Feel Elements
import { motion } from "motion/react";
import { FiLogOut, FiShield } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(null));
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.01)] sticky top-0 z-50 font-sans px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
        {/* Left Side: Title & Icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-sm">
            <FiShield size={16} className="text-emerald-400" />
          </div>
          <h1
            className="font-bold text-slate-900 tracking-tight text-sm sm:text-base cursor-pointer"
            onClick={() => navigate("/")}
          >
            Ecommerce{" "}
            <span className="text-slate-400 font-normal">Admin Panel</span>
          </h1>
        </div>

        {/* Right Side: Logout Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-2 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 hover:bg-red-50/50 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
        >
          <FiLogOut size={15} />
          <span>Logout</span>
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
