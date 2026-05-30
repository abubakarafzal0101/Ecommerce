import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productSlice.js";
import authSlice from "./slices/authSlice.js";
const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authSlice,
  },
});

export default store;
