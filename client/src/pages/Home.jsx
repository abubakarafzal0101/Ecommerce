import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import useFetchProducts from "../utils/useFetchProducts";
import { Link } from "react-router-dom";

// Smooth UX elements
import { motion } from "motion/react";
import { FiArrowRight, FiDollarSign } from "react-icons/fi";

const Home = () => {
  const { products } = useSelector((state) => state.product);
  useFetchProducts();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col text-slate-900 pb-16">
      {/* Client Facing Top Navigation */}
      <Navbar />

      {/* Main Content Layout Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Dynamic Catchy Header Section */}
        <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Discover Our Collection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore curated design essentials with timeless architectural
            aesthetic.
          </p>
        </div>

        {/* 🛍️ Premium Adaptive Product Grid Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products &&
            products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="block bg-white rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full flex flex-col transition-all duration-300"
                >
                  {/* Product Image Frame Wrapper */}
                  <div className="w-full aspect-[4/5] bg-slate-50 overflow-hidden relative flex items-center justify-center p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 animate-pulse" />
                    )}

                    {/* Quick Action Overlay Tag */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md text-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 shadow-sm">
                      <FiArrowRight size={14} />
                    </div>
                  </div>

                  {/* Content Core Body Area */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-1.5">
                      {/* Item Heading */}
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight line-clamp-1 group-hover:text-black transition-colors">
                        {product.title}
                      </h3>

                      {/* Clean Truncated Multi-line Description */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {product.description ||
                          "No dynamic catalog specifications details updated."}
                      </p>
                    </div>

                    {/* Cost Allocation Metadata Block */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <div className="flex items-baseline font-extrabold text-slate-950 text-base sm:text-lg tracking-tight">
                        <FiDollarSign
                          size={14}
                          className="text-slate-400 self-center mr-px"
                        />
                        <span>{parseFloat(product.price).toFixed(2)}</span>
                      </div>

                      {/* Size reference mini tag preview */}
                      {product.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
