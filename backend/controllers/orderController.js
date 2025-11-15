import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
    });

    // Clear user cart after ordering
    await userModel.findByIdAndUpdate(req.user._id, { cart: [] });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET LOGGED-IN USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
