import { Link, useNavigate } from "react-router-dom";
import { setToken, setUserData } from "../redux/slices/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

// Smooth UI components
import { motion } from "motion/react";
import { FiShoppingCart, FiLogOut, FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Agar aapke paas cart state hai toh length nikal sakte hain (Optional reference)
  // const { cart } = useSelector((state) => state.cart || { cart: [] });

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(null));
    dispatch(setUserData(null));
    navigate("/login"); // User ko redirect karne ke liye
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.01)] sticky top-0 z-50 font-sans px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
        {/* Left: Brand App Title */}
        <Link to="/" className="flex items-center gap-2 text-slate-900 group">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-sm">
            <FiShoppingBag size={16} />
          </div>
          <h1 className="font-extrabold tracking-tight text-base sm:text-lg">
            Ecommerce<span className="text-slate-400 font-normal">App</span>
          </h1>
        </Link>

        {/* Right: Actions (Cart Page Link & Logout Button) */}
        <div className="flex items-center gap-4">
          {/* Cart Icon Link */}
          <Link
            to="/cart"
            className="relative p-2.5 text-slate-600 hover:text-black hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center"
          >
            <FiShoppingCart size={19} />
            {/* Soft dot badge indicator for premium feel */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />
          </Link>

          {/* Logout Trigger */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 hover:bg-red-50/50 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
          >
            <FiLogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
