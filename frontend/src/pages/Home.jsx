import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Lock } from "lucide-react";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* HERO SECTION — FULL PAGE */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4 mt-20">
        <h2 className="text-4xl sm:text-5xl font-extrabold">
          Welcome to <span className="text-emerald-600">Global Mart</span>
        </h2>

        <p className="mt-4 text-gray-600 text-lg max-w-lg">
          Discover the best products at unbeatable prices — fast delivery,
          secure payments and premium quality.
        </p>

        <div className="mt-8 flex gap-4">
          {/* SHOP BUTTON */}
          <Link to="/products">
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 transition">
              Start Shopping
            </button>
          </Link>

          {/* SIGNUP BUTTON — ONLY IF NOT LOGGED IN */}
          {!user && (
            <Link to="/auth">
              <button className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition">
                Sign Up Now
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* WHY SHOP WITH US */}
      <section className="bg-gray-50 py-16 px-6">
        <h3 className="text-center text-2xl font-semibold mb-10">
          Why Shop With Us?
        </h3>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <ShoppingBag className="mx-auto w-12 h-12 text-emerald-600" />
            <h4 className="text-lg font-bold mt-4">Wide Selection</h4>
            <p className="text-gray-600 mt-2">
              Explore 1000+ premium products across categories.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <Truck className="mx-auto w-12 h-12 text-emerald-600" />
            <h4 className="text-lg font-bold mt-4">Fast Delivery</h4>
            <p className="text-gray-600 mt-2">
              Quick and reliable shipping to your doorstep.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <Lock className="mx-auto w-12 h-12 text-emerald-600" />
            <h4 className="text-lg font-bold mt-4">Secure Payments</h4>
            <p className="text-gray-600 mt-2">
              100% safe and encrypted checkout system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
