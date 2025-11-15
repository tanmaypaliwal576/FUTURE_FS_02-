import Product from "../models/productModel.js";
import cloudinary from "../lib/cloudinary.js";

// ===================================================
// CREATE PRODUCT (ADMIN ONLY)  — supports image upload

export const createProduct = async (req, res) => {
  try {
    console.log("====== CREATE PRODUCT START ======");
    console.log("hello");
    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
    console.log("REQ FILE:", JSON.stringify(req.file, null, 2));

    let images = [];

    if (req.file) {
      images.push({
        url: req.file.path,
        public_id: req.file.filename,
      });
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images,
      createdBy: req.user._id,
    });

    console.log("PRODUCT CREATED SUCCESSFULLY:", product);

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error); // FULL ERROR DETAILS
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

// ===================================================
// GET ALL PRODUCTS
// ===================================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================================
// GET SINGLE PRODUCT
// ===================================================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================================
// UPDATE PRODUCT (ADMIN ONLY) — supports new image upload
// ===================================================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    let updatedImages = product.images;

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (product.images.length > 0 && product.images[0].public_id) {
        await cloudinary.uploader.destroy(product.images[0].public_id);
      }

      updatedImages = [
        {
          url: req.file.path,
          public_id: req.file.filename,
        },
      ];
    }

    // Update product
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        images: updatedImages,
      },
      { new: true }
    );

    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================================
// DELETE PRODUCT (ADMIN)
// ===================================================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // delete image from cloudinary
    if (product.images.length > 0 && product.images[0].public_id) {
      await cloudinary.uploader.destroy(product.images[0].public_id);
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
