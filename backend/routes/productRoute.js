import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadImage.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ==========================
// PUBLIC ROUTES
// ==========================
router.get("/", getProducts);

// ==========================
// ADMIN ROUTES — MUST BE ABOVE "/:id"
// ==========================

// CREATE PRODUCT
router.post("/create", protect, isAdmin, upload.single("image"), createProduct);

// UPDATE PRODUCT
router.put(
  "/update/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateProduct
);

// DELETE PRODUCT
router.delete("/delete/:id", protect, isAdmin, deleteProduct);

// ==========================
// PUBLIC SINGLE PRODUCT ROUTE
// ==========================
router.get("/:id", getProductById);

export default router;
