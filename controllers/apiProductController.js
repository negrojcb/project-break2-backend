const Product = require("../models/Product");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching product" });
  }
};

const createProductApi = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;

    const product = await Product.create({
      name,
      description,
      image,
      category,
      size,
      price: Number(price),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating product" });
  }
};

const updateProductApi = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const { name, description, image, category, size, price } = req.body;

    const updated = await Product.findByIdAndUpdate(
      productId,
      { name, description, image, category, size, price: Number(price) },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updated) return res.status(404).json({ error: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error updating product" });
  }
};

const deleteProductApi = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const deleted = await Product.findByIdAndDelete(productId).lean();
    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ deleted: true, id: productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductApi,
  updateProductApi,
  deleteProductApi,
};
