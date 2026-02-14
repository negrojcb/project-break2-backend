const express = require("express");
const router = express.Router();
const {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
} = require("../controllers/productController");

router.get("/products", showProducts);
router.get("/products/:productId", showProductById);
router.get("/dashboard/new", showNewProduct);
router.post("/dashboard", createProduct);

router.get("/dashboard", (req, res) => {
  res.send(
    "<h1>Dashboard OK</h1><p>Producto creado (si todo salió bien) </p><a href='/dashboard/new'>Crear otro</a>",
  );
});

module.exports = router;
