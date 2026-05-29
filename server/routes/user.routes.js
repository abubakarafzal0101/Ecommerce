import express from "express";
import { auth } from "../middlewares/auth.js";
import { getCurrentUser } from "../controllers/user.controllers.js";
const userRouter = express.Router();

userRouter.get("/me", auth, getCurrentUser);

export default userRouter;
