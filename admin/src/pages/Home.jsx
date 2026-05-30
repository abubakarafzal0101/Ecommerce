import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// Framer Motion & React Icons
import { motion } from "motion/react";
import { FiTrendingUp, FiSettings, FiActivity } from "react-icons/fi";
import { useFetchProducts } from "../utils/useFetchProducts";

const Home = () => {
  const urlPath = useLocation().pathname;
  useFetchProducts();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col text-slate-900">
      {/* Header Layout components */}
      <Navbar />
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        {/* Dynamic Nested Routes */}
        <Outlet />

        {/* Minimal Welcome View */}
        {urlPath === "/" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-6 max-w-2xl mx-auto py-12"
          >
            {/* Status Indicator Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-medium px-3 py-1.5 rounded-full text-xs mx-auto border border-emerald-100/50">
              <FiTrendingUp size={14} className="animate-pulse" />
              <span>System Online & Secure</span>
            </div>

            {/* Welcome Heading */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome to Ecommerce Admin Panel
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Your central control station is ready. Use the navigation links
                above to fluidly manage products, update details, or audit
                incoming store orders.
              </p>
            </div>

            {/* Quick System Diagnostics Micro-badges */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-100 max-w-md mx-auto">
              <span className="flex items-center gap-1.5">
                <FiActivity size={14} /> Production Mode
              </span>
              <span className="flex items-center gap-1.5">
                <FiSettings size={14} /> v1.0.0 Stable
              </span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
