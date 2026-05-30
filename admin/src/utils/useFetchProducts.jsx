import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/slices/productSlice";

export const useFetchProducts = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    // 1. Guard Clause: Agar token hi nahi hai toh API hit karne ki zaroorat nahi hai
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/admin/get-all-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response?.data?.success) {
          dispatch(setProducts(response.data.products));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [serverUrl, token, dispatch]);
};
