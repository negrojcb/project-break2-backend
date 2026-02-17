const express = require("express");
const router = express.Router();
const {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
  showDashboard,
  showDashboardProductById,
  showEditProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { ensureAdmin } = require("../middlewares/authMiddlewares");

router.get("/products", showProducts);
router.get("/products/:productId", showProductById);
router.get("/dashboard/new", ensureAdmin, showNewProduct);
router.post("/dashboard", ensureAdmin, createProduct);
router.get("/dashboard", ensureAdmin, showDashboard);
router.get("/dashboard/:productId", ensureAdmin, showDashboardProductById);
router.get("/dashboard/:productId/edit", ensureAdmin, showEditProduct);
router.put("/dashboard/:productId", ensureAdmin, updateProduct);
router.delete("/dashboard/:productId/delete", ensureAdmin, deleteProduct);

module.exports = router;
