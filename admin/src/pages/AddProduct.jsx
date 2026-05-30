import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

// React Icons & Framer Motion
import { motion } from "motion/react";
import { FiPlus, FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import { useFetchProducts } from "../utils/useFetchProducts";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // Handles Local Image Preview Generation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Real-time client preview
    }
  };

  const handleSizesChange = (sizeName) => {
    if (sizes.includes(sizeName)) {
      setSizes(sizes.filter((size) => size !== sizeName));
    } else {
      setSizes([...sizes, sizeName]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!image) {
      return toast.error("Please upload a product image");
    }

    setIsLoading(true);

    // Dynamic clean Form Data construction inside the handler
    const productData = new FormData();
    productData.append("title", title);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("category", category);
    productData.append("subCategory", subCategory);
    productData.append("sizes", JSON.stringify(sizes));
    productData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${serverUrl}/api/admin/add-product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        toast.success(response.data.message);

        // Resetting all states smoothly
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setSizes([]);
        setImage(null);
        setImagePreview("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const availableSizes = ["S", "M", "L", "XL"];
  useFetchProducts();
  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-[0_4px_25px_rgb(0,0,0,0.01)] font-sans mt-4">
      <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleAddProduct} className="space-y-6">
        {/* Media Upload Area with Interactive Preview */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Product Image
          </label>

          {!imagePreview ? (
            <label className="border-2 border-dashed border-slate-200 hover:border-black bg-[#f8fafc] rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
              <div className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center text-slate-500 group-hover:text-black transition-colors">
                <FiUploadCloud size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Click to upload photo
              </span>
              <span className="text-xs text-slate-400">
                Supports PNG, JPG up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isLoading}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full object-contain"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setImage(null);
                  setImagePreview("");
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg shadow border border-slate-100 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Product Title
          </label>
          <input
            type="text"
            placeholder="e.g. Minimalist Premium Cotton Tee"
            disabled={isLoading}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Write details about fabric, fitting specs, and look..."
            disabled={isLoading}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 resize-none disabled:opacity-60"
            required
          />
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Price ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              disabled={isLoading}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              disabled={isLoading}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm outline-none cursor-pointer disabled:opacity-60 text-slate-700"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Casual Shirts">Casual Shirts</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sub-Category
            </label>
            <select
              value={subCategory}
              disabled={isLoading}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm outline-none cursor-pointer disabled:opacity-60 text-slate-700"
              required
            >
              <option value="" disabled>
                Select Sub-Category
              </option>
              <option value="Summer-wear">Summer-wear</option>
              <option value="Winter-wear">Winter-wear</option>
              <option value="Normal-wear">Normal-wear</option>
            </select>
          </div>
        </div>

        {/* Available Sizes Layout */}
        <div className="flex flex-col gap-2.5 pt-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available Sizes
          </label>
          <div className="flex items-center gap-2">
            {availableSizes.map((size) => {
              const isSelected = sizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  disabled={isLoading}
                  onClick={() => handleSizesChange(size)}
                  className={`w-11 h-11 rounded-xl text-xs font-bold tracking-wider transition-all border cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? "bg-black border-black text-white shadow-sm shadow-black/10"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Trigger Action */}
        <div className="pt-4">
          <motion.button
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium text-sm py-3 rounded-xl hover:bg-slate-900 shadow-md shadow-black/5 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                <span>Publishing Product...</span>
              </>
            ) : (
              <>
                <FiPlus size={16} />
                <span>Publish Product</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
