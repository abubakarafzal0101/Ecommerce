import express from "express";
import {
  addProduct,
  adminLogin,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  testAdmin,
} from "../controllers/admin.controllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";
const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

adminRouter.get("/test", adminAuth, testAdmin);

adminRouter.post("/add-product", adminAuth, upload.single("image"), addProduct);
adminRouter.delete("/delete-product/:productId", adminAuth, deleteProduct);
adminRouter.get("/get-all-products", getAllProducts);
adminRouter.get("/get-single-product", getSingleProduct);

export default adminRouter;
