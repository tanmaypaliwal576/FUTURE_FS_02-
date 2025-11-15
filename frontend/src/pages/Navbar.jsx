import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  ListOrdered,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // ⬅ For detecting outside click

  // Load user from localStorage
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    updateUser();
    window.addEventListener("storage", updateUser);

    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="w-full flex justify-between items-center px-10 py-4 shadow-sm fixed top-0 bg-white z-20">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-emerald-600 cursor-pointer">
          Global Mart
        </h1>
      </Link>

      {/* Navigation */}
      <ul className="flex gap-8 text-gray-600 font-medium">
        <Link to="/">
          <li className="cursor-pointer hover:text-emerald-500">Home</li>
        </Link>
        <Link to="/products">
          <li className="cursor-pointer hover:text-emerald-500">Shop</li>
        </Link>
      </ul>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* If NOT logged in */}
        {!user ? (
          <Link
            to="/auth"
            className="text-emerald-600 font-medium hover:text-emerald-700"
          >
            Login / Register
          </Link>
        ) : (
          <>
            {/* Username + dropdown */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
            >
              <User size={20} />
              <span className="font-medium">{user.fullname}</span>
              <ChevronDown size={16} />
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute top-12 right-0 w-56 bg-white shadow-xl rounded-md border border-gray-200 p-2 z-50">
                <Link
                  to="/cart"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-100"
                >
                  <ShoppingCart size={18} />
                  <span>My Cart</span>
                </Link>

                <Link
                  to="/myorders"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-100"
                >
                  <ShoppingBag size={18} />
                  <span>Order History</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-100"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <hr className="my-2" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 p-3 rounded-md hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
