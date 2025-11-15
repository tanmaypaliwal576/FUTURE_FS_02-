import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders/my", {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to load orders");
      }
    };
    loadOrders();
  }, []);

  return (
    <div className="pt-24 px-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-xl shadow-sm border mb-6"
          >
            <div className="flex justify-between mb-4">
              <p className="font-semibold text-gray-700">
                Order ID: {order._id}
              </p>
              <p className="text-emerald-600 font-bold">₹{order.totalAmount}</p>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.productId?.images?.[0]?.url ||
                        "https://placehold.co/60"
                      }
                      className="w-14 h-14 rounded-md border object-cover"
                    />

                    <div>
                      <p className="font-medium">
                        {item.productId?.name || "Product Deleted"}
                      </p>

                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-700">
                    ₹{(item.productId?.price || 0) * item.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
