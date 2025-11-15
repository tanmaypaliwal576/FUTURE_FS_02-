import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Payment() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // LOAD CART FROM BACKEND
  useEffect(() => {
    const loadCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          toast.error("Login first!");
          return navigate("/auth");
        }

        const res = await axios.get("http://localhost:3000/cart", {
          withCredentials: true,
        });

        setCart(res.data.cart || []);

        const total = (res.data.cart || []).reduce(
          (acc, item) => acc + item.productId.price * item.qty,
          0
        );

        setSubtotal(total);
      } catch (err) {
        toast.error("Failed to load cart");
      }
    };

    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FORM HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PLACE ORDER
  const placeOrder = async () => {
    // validate fields
    for (let key in form) {
      if (!form[key]) {
        toast.error("Please fill all required fields");
        return;
      }
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId._id,
          qty: item.qty,
          price: item.productId.price,
        })),
        totalAmount: subtotal,
        address: form,
      };

      await axios.post("http://localhost:3000/orders", orderData, {
        withCredentials: true,
      });

      toast.success("Order placed successfully!");

      // optional: you may want to call an endpoint to clear cart.
      // navigate to myorders
      navigate("/myorders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="pt-20 px-10 pb-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-emerald-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded-md h-11 px-4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-emerald-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">
                Payment Details
              </h2>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                className="w-full border rounded-md h-11 px-4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div>
                <label className="block text-gray-700 mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-full border rounded-md h-11 px-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="border border-gray-200 rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {item.productId.name} × {item.qty}
                  </span>
                  <span className="font-semibold">
                    ₹{item.productId.price * item.qty}
                  </span>
                </div>
              ))
            )}
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
