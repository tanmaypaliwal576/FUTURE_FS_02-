import userModel from "../models/userModel.js";
import Product from "../models/productModel.js";

// ==========================
// Add to Cart
// ==========================
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await userModel.findById(req.user._id);

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if already in cart
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      user.cart.push({ productId, qty: 1 });
    }

    await user.save();
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// Get User Cart

export const getCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("cart.productId");

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// Update Quantity
// ==========================
export const updateCartQty = async (req, res) => {
  try {
    const { productId, action } = req.body;

    const user = await userModel.findById(req.user._id);

    const item = user.cart.find((i) => i.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "increase") item.qty += 1;
    if (action === "decrease" && item.qty > 1) item.qty -= 1;

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// Remove Cart Item
// ==========================
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await userModel.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
