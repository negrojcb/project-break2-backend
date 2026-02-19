const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} = require("../controllers/apiProductController");

router.get("/products", getProducts);
router.get("/products/:productId", getProductById);
router.post("/products", createProductApi);
router.put("/products/:productId", updateProductApi);
router.delete("/products/:productId", deleteProductApi);

module.exports = router;
