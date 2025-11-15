import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      toast.error("Access Denied!");
      navigate("/");
    }
  }, []);

  // Load products
  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data.products);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: 1,
    imageFile: null,
    preview: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      imageFile: file,
      preview: URL.createObjectURL(file),
    });
  };

  // ================= ADD PRODUCT =================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("stock", form.stock);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      await axios.post("http://localhost:3000/products/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added!");
      setShowForm(false);
      loadProducts();
    } catch (error) {
      toast.error("Failed to add product");
      console.log("UPLOAD ERROR:", error);
    }
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("stock", form.stock);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      // FIXED ROUTE
      await axios.put(
        `http://localhost:3000/products/update/${editProduct._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Product updated!");
      setEditProduct(null);
      setShowForm(false);
      loadProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      // FIXED ROUTE
      await axios.delete(`http://localhost:3000/products/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="pt-28 px-10 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={28} className="text-emerald-600" />
          Admin Dashboard
        </h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            setForm({
              name: "",
              price: "",
              category: "",
              description: "",
              stock: 1,
              imageFile: null,
              preview: "",
            });
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <img
                    src={
                      p.images?.length
                        ? p.images[0].url
                        : "https://placehold.co/60"
                    }
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>

                <td className="font-medium">{p.name}</td>
                <td className="text-gray-500">{p.category}</td>
                <td className="font-semibold text-emerald-600">₹{p.price}</td>
                <td>{p.stock}</td>

                <td className="flex gap-3 justify-center py-3">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setEditProduct(p);
                      setShowForm(true);
                      setForm({
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        description: p.description,
                        stock: p.stock,
                        imageFile: null,
                        preview: p.images?.[0]?.url || "",
                      });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md border relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditProduct(null);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
            >
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="price"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              {/* Image Upload */}
              <div>
                <label className="block font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg"
                />

                {form.preview && (
                  <img
                    src={form.preview}
                    className="w-32 h-32 object-cover mt-3 rounded-lg border"
                  />
                )}
              </div>

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                rows="3"
              />

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
