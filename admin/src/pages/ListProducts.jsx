import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setProducts } from "../redux/slices/productSlice";

// React Icons & Framer Motion Animations
import { motion, AnimatePresence } from "motion/react";
import {
  FiTrash2,
  FiShoppingBag,
  FiLayers,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const ListProducts = () => {
  const dispatch = useDispatch();
  // Fetching products array safely from redux state
  const { products } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // States for deleting/loading animations
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Dynamic Product Delete Core Handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setIsDeletingId(productId); // Trigger loading spin only for this specific product item
    try {
      const response = await axios.delete(
        `${serverUrl}/api/admin/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "Product removed successfully");

        // Instant Redux State Sync: Filtering out the deleted product locally
        const updatedProducts = products.filter(
          (item) => item._id !== productId,
        );
        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete item");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto mt-4">
      {/* 📊 Top Smart Header Panel & Quick Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Left Side Details */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-center">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventory Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit, modify, or eliminate existing items live from the
            marketplace.
          </p>
        </div>

        {/* Total Products Counter Grid Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Products
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {products?.length || 0}{" "}
              <span className="text-xs text-slate-400 font-medium font-sans">
                items listed
              </span>
            </h2>
          </div>
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-md shadow-black/5">
            <FiLayers size={18} />
          </div>
        </div>
      </div>

      {/* 📦 Products Table List Grid View */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        {products && products.length === 0 ? (
          /* Empty Inventory Placeholder View */
          <div className="text-center py-20 space-y-3">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
              <FiShoppingBag size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No products found
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your inventory is currently blank. Head over to the Add Product
              tab to publish new items.
            </p>
          </div>
        ) : (
          /* Active Inventory Matrix Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Product details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Sizes</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 text-sm">
                <AnimatePresence>
                  {products?.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Image & Title Meta Column */}
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiShoppingBag
                              className="text-slate-300"
                              size={16}
                            />
                          )}
                        </div>
                        <div className="max-w-xs sm:max-w-md">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5 max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </td>

                      {/* Category & SubCategory badges */}
                      <td className="py-4 px-4 vertical-align-middle">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <FiTag size={10} className="text-slate-400" />
                          {product.category}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1 pl-1">
                          {product.subCategory || "General"}
                        </span>
                      </td>

                      {/* Item Sizes Array tags */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-[120px]">
                          {Array.isArray(product.sizes) ? (
                            product.sizes.map((size, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-extrabold tracking-wide bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md shadow-2xs"
                              >
                                {size}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Price Element */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div className="flex items-center text-slate-800">
                          <FiDollarSign
                            size={13}
                            className="text-slate-400 mr-px"
                          />
                          <span>{parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Dangerous Actions - Delete Trigger Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          disabled={isDeletingId === product._id}
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2.5 inline-flex items-center justify-center border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                        >
                          {isDeletingId === product._id ? (
                            <FaSpinner
                              className="animate-spin text-red-500"
                              size={14}
                            />
                          ) : (
                            <FiTrash2 size={14} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProducts;
