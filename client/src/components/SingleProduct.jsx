import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleProduct } from "../redux/slices/productSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

// Design Elements & Icons
import { motion } from "motion/react";
import { FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SingleProduct = () => {
  const { productId } = useParams();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { token } = useSelector((state) => state.user);
  const { singleProduct } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  // Local Page UX states
  const [selectedSize, setSelectedSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/admin/get-single-product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response?.data?.success) {
          dispatch(setSingleProduct(response.data.product));
          // Pre-select first size if available
          if (response.data.product?.sizes?.length > 0) {
            setSelectedSize(response.data.product.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleProduct();

    // Cleanup phase: Reset state when component unmounts to prevent visual flashing
    return () => {
      dispatch(setSingleProduct(null));
    };
  }, [token, productId, dispatch, serverUrl]);

  // 🛍️ Add To Cart Handler API Sync
  const handleAddToCart = async () => {
    if (!selectedSize) {
      return toast.error("Please select a size first");
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/add-to-cart`,
        { productId, size: selectedSize },
        {
          headers: {
            Authorization: `Bearer ${token}`, // pass 'auth' middleware context
          },
        },
      );

      if (response?.data?.success) {
        toast.success("Added to cart successfully!");

        // Note: Agar aapne global state mein user update ka action banaya hai
        // toh yahan dispatch karke cartData locally bhi sync kar sakte hain.
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to add item to cart",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col text-slate-900 pb-16">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 flex flex-col justify-center">
        {/* Back Link Trigger */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-black transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Back to collection</span>
          </Link>
        </div>

        {/* Global Spinner Frame Loading State */}
        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-black" size={26} />
            <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">
              Loading product profile...
            </span>
          </div>
        ) : !singleProduct ? (
          /* Missing Product Exception Layer */
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs">
            <h3 className="font-bold text-lg text-slate-900">
              Product profile missing
            </h3>
            <p className="text-sm text-slate-400">
              The product parameters requested could not be fetched or do not
              exist in storage context.
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
            >
              Return Home
            </Link>
          </div>
        ) : (
          /* ⚡ Premium Product Detail Workspace Split Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-[0_4px_30px_rgb(0,0,0,0.01)] items-center">
            {/* Left Box Layer: Image Presentation Studio */}
            <div className="w-full aspect-[4/5] bg-[#f8fafc] rounded-2xl overflow-hidden relative flex items-center justify-center p-6 border border-slate-50">
              {singleProduct.image ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={singleProduct.image}
                  alt={singleProduct.title}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-slate-300 flex flex-col items-center gap-2">
                  <FiShoppingBag size={24} />
                  <span className="text-xs">
                    No media preview profile available
                  </span>
                </div>
              )}
            </div>

            {/* Right Box Layer: Explicit Meta Details Content Panel */}
            <div className="space-y-6 sm:space-y-8">
              {/* Heading Titles & Categories */}
              <div className="space-y-3">
                {singleProduct.category && (
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                    {singleProduct.category}{" "}
                    {singleProduct.subCategory &&
                      `• ${singleProduct.subCategory}`}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {singleProduct.title}
                </h1>
                <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
                  ${parseFloat(singleProduct.price).toFixed(2)}
                </div>
              </div>

              {/* Functional Description Text */}
              <div className="space-y-2 border-t border-slate-50 pt-5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Overview Specifications
                </h4>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
                  {singleProduct.description ||
                    "No core architectural dynamic catalog specifications detail data uploaded yet."}
                </p>
              </div>

              {/* Interactive Dynamic Sizes Selector */}
              {singleProduct.sizes && singleProduct.sizes.length > 0 && (
                <div className="space-y-3 border-t border-slate-50 pt-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Select Available Size
                    </h4>
                    {selectedSize && (
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        Size: {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {singleProduct.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-xl text-xs font-bold tracking-wider transition-all border cursor-pointer flex items-center justify-center relative ${
                            isSelected
                              ? "bg-black border-black text-white shadow-md shadow-black/10"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                          }`}
                        >
                          {size}
                          {isSelected && (
                            <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-400 rounded-full flex items-center justify-center text-[6px]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Purchase Call to Action Control panel */}
              <div className="pt-4 border-t border-slate-50">
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAddToCart}
                  className={`w-full bg-black text-white font-medium text-sm py-4 rounded-xl shadow-md shadow-black/5 transition-all flex items-center justify-center gap-2.5 ${
                    isSubmitting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-slate-900 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : (
                    <FiShoppingBag size={16} />
                  )}
                  <span>
                    {isSubmitting
                      ? "Processing..."
                      : "Secure bag / Add to Cart"}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SingleProduct;
