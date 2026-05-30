import express from "express";
import {
  googleLogin,
  googleRegister,
  userLogin,
  userRegister,
} from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/register", userRegister);

authRouter.post("/login", userLogin);

authRouter.post("/google-login", googleLogin);

authRouter.post("/google-register", googleRegister);

export default authRouter;
