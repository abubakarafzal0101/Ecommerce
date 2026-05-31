import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

// Smooth UI components & Icons
import { motion, AnimatePresence } from "motion/react";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiDollarSign,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const Cart = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  // Redux states sync context
  const { token } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const { userData } = useSelector((state) => state.user);

  // Local component processing states
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isUpdatingId, setIsUpdatingId] = useState(null); // specific button lock variable

  // 🔄 Structural Effect: Redux global matrix processing schema
  useEffect(() => {
    if (products.length > 0 && userData?.cartData) {
      const tempCartData = [];
      let total = 0;

      // Extract details by matching productIds and nested structural sizes
      for (const itemsId in userData.cartData) {
        for (const size in userData.cartData[itemsId]) {
          if (userData.cartData[itemsId][size] > 0) {
            // Reference search from existing global catalog cache array
            const productInfo = products.find(
              (product) => product._id === itemsId,
            );

            if (productInfo) {
              tempCartData.push({
                _id: itemsId,
                size: size,
                quantity: userData.cartData[itemsId][size],
                title: productInfo.title,
                price: productInfo.price,
                image: productInfo.image,
                category: productInfo.category,
              });

              // Increment checkout price matrix total
              total += productInfo.price * userData.cartData[itemsId][size];
            }
          }
        }
      }
      setCartItems(tempCartData);
      setCartTotal(total);
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [userData, products]);

  // ⚡ Cart Increments / Decrements Request Action Middleware Handlers
  const handleQuantityUpdate = async (productId, size, actionType) => {
    const lockKey = `${productId}-${size}`;
    if (isUpdatingId) return;

    setIsUpdatingId(lockKey);
    // Dynamic absolute endpoint execution assignment mapping matrix
    const endpoint =
      actionType === "increment" ? "add-to-cart" : "remove-from-cart";

    try {
      const response = await axios.post(
        `${serverUrl}/api/user/${endpoint}`,
        { productId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`, // pass 'auth' secure layout configuration header
          },
        },
      );

      if (response?.data?.success) {
        toast.success(
          actionType === "increment" ? "Item added" : "Item removed",
        );

        // 🚨 IMPORTANT NOTE: Backend successfully sync hone ke baad, local execution context
        // ko immediate update show karne ke liye aapko yahan apna userProfile re-fetch execute
        // karna hoga, jisse 'userData.cartData' dynamically load ho jaye.
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to alter quantity matrix state");
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col text-slate-900 pb-16">
      {/* Universal Web Navbar Header */}
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex-1 flex flex-col">
        {/* Dynamic Cart Heading Label Details */}
        <div className="border-b border-slate-100 pb-5 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review items, adjust structural variations, or progress to secure
            checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Storage Data Fallback Component Layout Blueprint */
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center max-w-md w-full mx-auto my-auto space-y-4 shadow-2xs">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <FiShoppingBag size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              Your cart index is blank
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our curation collection spaces to append dynamic product
              models inside your secure personal bag.
            </p>
          </div>
        ) : (
          /* ⚡ Main Split Master Interactive Processing Columns Matrix Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Box Panel: Array Product Collection Records Listing Card List */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-[0_4px_30px_rgb(0,0,0,0.01)] divide-y divide-slate-50">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemLockId = `${item._id}-${item.size}`;
                  const isCurrentLock = isUpdatingId === itemLockId;

                  return (
                    <motion.div
                      key={itemLockId}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      {/* Image Preview Window & Spec Layouts mapping text details */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-[#f8fafc] border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <span>
                              Size:{" "}
                              <strong className="text-slate-700">
                                {item.size}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                          <div className="flex items-center text-slate-900 font-extrabold text-sm sm:text-base mt-1.5 tracking-tight">
                            <FiDollarSign
                              size={12}
                              className="text-slate-400 mr-px"
                            />
                            <span>{parseFloat(item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Operations Actions Control Block (Plus / Minus / Trash triggers) */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t border-slate-50 sm:border-0 pt-3 sm:pt-0">
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1">
                          <button
                            disabled={isCurrentLock}
                            onClick={() =>
                              handleQuantityUpdate(
                                item._id,
                                item.size,
                                "decrement",
                              )
                            }
                            className="w-8 h-8 rounded-lg hover:bg-white text-slate-500 hover:text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-slate-800 flex items-center justify-center">
                            {isCurrentLock ? (
                              <FaSpinner
                                className="animate-spin text-slate-400"
                                size={10}
                              />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            disabled={isCurrentLock}
                            onClick={() =>
                              handleQuantityUpdate(
                                item._id,
                                item.size,
                                "increment",
                              )
                            }
                            className="w-8 h-8 rounded-lg hover:bg-white text-slate-500 hover:text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        {/* Instant Clean Slate Drop Item Action Button */}
                        <button
                          disabled={isCurrentLock}
                          onClick={() =>
                            handleQuantityUpdate(
                              item._id,
                              item.size,
                              "decrement",
                            )
                          }
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right Box Panel: Calculations / Total Financial Ledger Card summary box widget */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_30px_rgb(0,0,0,0.01)] space-y-6 lg:sticky lg:top-24">
              <h3 className="font-extrabold text-base tracking-tight text-slate-900">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm text-slate-500 border-b border-slate-50 pb-5">
                <div className="flex justify-between">
                  <span>Subtotal Matrix cost</span>
                  <span className="font-semibold text-slate-800">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Fulfillment</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    FREE
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-slate-900 text-sm">
                  Estimated Total
                </span>
                <span className="text-2xl font-black text-slate-950 tracking-tight flex items-baseline">
                  <FiDollarSign
                    size={16}
                    className="text-slate-400 self-center mr-px"
                  />
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Secure Checkout Progression Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm shadow-md shadow-black/5 hover:bg-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight size={15} />
              </motion.button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
