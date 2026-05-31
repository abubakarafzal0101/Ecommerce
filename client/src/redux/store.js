import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice.js";
import productSlice from "./slices/productSlice.js";
const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
  },
});

export default store;
