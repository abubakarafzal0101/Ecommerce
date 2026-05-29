import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";
const genToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log("Jwt genToken Error", error);
  }
};

export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = await genToken(newUser._id);
    return res
      .status(200)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log("User Register Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await genToken(user._id);
      return res
        .status(200)
        .json({ success: true, message: "User logged in successfully", token });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("User Login Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const firebaseToken = req.body.token;
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    if (!decodedToken) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
    const { name, email } = decodedToken;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const token = await genToken(user._id);
    return res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.log("Google Login Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const googleRegister = async (req, res) => {
  try {
    const firebaseToken = req.body.token;
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    if (!decodedToken) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const { name, email } = decodedToken;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const newUser = await UserModel.create({
      username: name,
      email,
    });
    const token = await genToken(newUser._id);
    return res
      .status(200)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log("Google Register Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
