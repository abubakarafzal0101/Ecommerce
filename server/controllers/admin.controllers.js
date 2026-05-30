import jwt from "jsonwebtoken";
import ProductModel from "../models/product.model.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

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

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = await genToken(email);
    return res
      .status(200)
      .json({ success: true, message: "Admin logged in successfully", token });
  } catch (error) {
    console.log("Admin Login Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const testAdmin = async (req, res) => {
  try {
    const adminId = req.adminId;
    if (!adminId) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, adminId });
  } catch (error) {
    console.log("Admin Login Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    let { title, description, price, category, subCategory, sizes } = req.body;

    sizes = JSON.parse(sizes);

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !sizes
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    // Upload image to Cloudinary
    const uploadImage = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadedImage = await uploadImage();

    const product = await ProductModel.create({
      title,
      description,
      price,
      category,
      subCategory,
      sizes,
      image: uploadedImage.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("add product error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }

    await ProductModel.findByIdAndDelete(productId);
    return res.status(200).json({ success: true, message: "Product deleted!" });
  } catch (error) {
    console.log("delete product error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("get all products error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("get single product error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
