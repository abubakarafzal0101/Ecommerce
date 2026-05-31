import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("get current user error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.userId;
    if (!productId || !size) {
      return res
        .status(400)
        .json({ success: false, message: "Size is required!" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    const userData = await UserModel.findById(userId);
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

    if (!cartData[productId]) {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    } else if (!cartData[productId][size]) {
      cartData[productId][size] + 1;
    } else {
      cartData[productId][size] + 1;
    }

    await UserModel.findByIdAndUpdate(userId, {
      cartData,
    });

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log("add to cart error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res
        .status(400)
        .json({ success: false, message: "Size is required!" });
    }

    const userData = await UserModel.findById(userId);
    if (!userData && !userData.cartData) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData;

    if (cartData[productId][size]) {
      if (cartData[productId][size] > 1) {
        cartData[productId][size] -= 1;
      } else {
        delete cartData[productId][size];
      }
      if (Object.keys(cartData[productId].length === 0)) {
        delete cartData[productId];
      }
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    return res
      .status(200)
      .json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart server error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
