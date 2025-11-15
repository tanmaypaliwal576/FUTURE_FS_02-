import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateCartQty,
  removeCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartQty);
router.delete("/remove/:productId", protect, removeCartItem);

export default router;
