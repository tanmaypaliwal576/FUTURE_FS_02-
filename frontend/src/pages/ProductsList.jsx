import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ShoppingCart, ArrowUpDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductsList() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Default");

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const categories = [
    "All",
    "Electronics",
    "Clothes",
    "Mobiles",
    "Laptops",
    "Shoes",
    "Accessories",
  ];

  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹2000", min: 500, max: 2000 },
    { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
    { label: "₹5000+", min: 5000, max: Infinity },
  ];

  const sortOptions = [
    "Default",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Add to Cart
  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/cart/add",
        { productId: product._id },
        { withCredentials: true }
      );
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Filter + Sorting
  const filteredProducts = products
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      categoryFilter === "All" ? true : p.category === categoryFilter
    )
    .filter((p) => {
      const range = priceRanges.find((r) => r.label === priceFilter);
      return p.price >= range?.min && p.price <= range?.max;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.price - b.price;
      if (sortOption === "Price: High to Low") return b.price - a.price;
      if (sortOption === "Newest First")
        return new Date(b.createdAt) - new Date(a.createdAt);

      return 0; // Default
    });

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="pt-24 px-10">
        <h1 className="text-3xl font-bold">Our Products</h1>

        <div className="flex items-center gap-4 mt-6 relative">
          {/* SEARCH BAR */}
          <div className="flex items-center w-full border rounded-lg px-3 py-2 shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input
              className="w-full ml-2 outline-none text-sm"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY FILTER */}
          <div
            className="border rounded-lg px-3 py-2 flex items-center gap-2 text-sm shadow-sm cursor-pointer bg-white relative"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          >
            {categoryFilter}
            <ChevronDown size={16} />
            {showCategoryMenu && (
              <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-md w-40 z-20">
                {categories.map((c) => (
                  <p
                    key={c}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategoryFilter(c);
                      setShowCategoryMenu(false);
                    }}
                  >
                    {c}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* PRICE FILTER */}
          <div
            className="border rounded-lg px-3 py-2 flex items-center gap-2 text-sm shadow-sm cursor-pointer bg-white relative"
            onClick={() => setShowPriceMenu(!showPriceMenu)}
          >
            {priceFilter}
            <ChevronDown size={16} />
            {showPriceMenu && (
              <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-md w-44 z-20">
                {priceRanges.map((p) => (
                  <p
                    key={p.label}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setPriceFilter(p.label);
                      setShowPriceMenu(false);
                    }}
                  >
                    {p.label}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* SORTING FILTER */}
          <div
            className="border rounded-lg px-3 py-2 flex items-center gap-2 text-sm shadow-sm cursor-pointer bg-white relative"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <ArrowUpDown size={16} />
            {sortOption}
            <ChevronDown size={16} />
            {showSortMenu && (
              <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-md w-48 z-20">
                {sortOptions.map((s) => (
                  <p
                    key={s}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption(s);
                      setShowSortMenu(false);
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-10 py-10">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="w-full h-60 bg-gray-100 flex items-center justify-center">
                <img
                  src={p.images?.[0]?.url || "https://placehold.co/400x300"}
                  alt={p.name}
                  className="h-full object-contain"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.category}</p>

                <p className="text-emerald-600 font-bold text-lg mt-2">
                  ₹{p.price}
                </p>

                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 mt-4 rounded-md text-sm flex items-center justify-center gap-2 transition"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
