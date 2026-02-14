const mongoose = require("mongoose");

const CATEGORIES = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];
const SIZES = ["XS", "S", "M", "L", "XL"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true }, // URL (Cloudinary o similar)
    category: { type: String, required: true, enum: CATEGORIES },
    size: { type: String, required: true, enum: SIZES },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
