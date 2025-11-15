import React, { useEffect, useState } from "react";
import { Trash, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your cart");
      navigate("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:3000/cart", {
          withCredentials: true,
        });
        setCart(res.data.cart || []);
      } catch (err) {
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, []);

  // Increase Qty
  const increaseQty = async (productId) => {
    try {
      await axios.put(
        "http://localhost:3000/cart/update",
        { productId, action: "increase" },
        { withCredentials: true }
      );

      setCart((prev) =>
        prev.map((item) =>
          item.productId._id === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // Decrease Qty
  const decreaseQty = async (productId) => {
    try {
      await axios.put(
        "http://localhost:3000/cart/update",
        { productId, action: "decrease" },
        { withCredentials: true }
      );

      setCart((prev) =>
        prev.map((item) =>
          item.productId._id === productId && item.qty > 1
            ? { ...item, qty: item.qty - 1 }
            : item
        )
      );
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // Remove Item
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/remove/${productId}`, {
        withCredentials: true,
      });

      setCart((prev) => prev.filter((i) => i.productId._id !== productId));
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // Subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.productId.price * item.qty,
    0
  );

  return (
    <div className="pt-28 px-6 lg:px-20 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={
                      item.productId.images?.[0]?.url ||
                      "https://placehold.co/150"
                    }
                    alt={item.productId.name}
                    className="w-24 h-24 rounded-xl object-cover border"
                  />

                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.productId.name}
                    </h3>
                    <p className="text-emerald-600 font-semibold text-md">
                      ₹{item.productId.price}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <button
                      onClick={() => decreaseQty(item.productId._id)}
                      className="p-1 hover:bg-gray-200 rounded-md transition"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="font-semibold w-6 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.productId._id)}
                      className="p-1 hover:bg-gray-200 rounded-md transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-2xl text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <Link to="/payment">
              <button className="w-full py-3 rounded-lg bg-emerald-600 text-white text-lg font-medium hover:bg-emerald-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
