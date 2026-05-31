import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addToCart,
  getCurrentUser,
  removeFromCart,
} from "../controllers/user.controllers.js";
const userRouter = express.Router();
userRouter.get("/me", auth, getCurrentUser);
userRouter.post("/add-to-cart", auth, addToCart);
userRouter.post("/remove-from-cart", auth, removeFromCart);
export default userRouter;
