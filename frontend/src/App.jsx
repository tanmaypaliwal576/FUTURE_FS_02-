import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Products from "./pages/ProductsList";
import Navbar from "./pages/Navbar";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth page for BOTH Login + Register */}
        <Route path="/auth" element={<Auth />} />

        {/* Optional: Support /login also */}
        <Route path="/login" element={<Auth />} />

        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
