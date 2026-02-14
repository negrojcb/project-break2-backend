const Product = require("../models/Product");
const mongoose = require("mongoose");

const showProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    let cards = "";
    for (const p of products) {
      cards += `
        <div style="border:1px solid #ddd; padding:12px; margin:12px 0;">
          <img src="${p.image}" alt="${p.name}" style="max-width:200px; display:block;" />
          <h2>${p.name}</h2>
          <p>${p.description}</p>
          <p><strong>${p.price}€</strong></p>
          <a href="/products/${p._id}">Ver detalle</a>
        </div>
      `;
    }

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Tienda - Productos</title>
        </head>
        <body style="font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 24px;">
          <h1>Productos</h1>
          ${products.length ? cards : "<p>No hay productos todavía.</p>"}
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
};

const showProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product id");
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${product.name}</title>
        </head>
        <body style="font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 24px;">
          <a href="/products">← Volver</a>
          <h1>${product.name}</h1>
          <img src="${product.image}" alt="${product.name}" style="max-width:400px; display:block;" />
          <p>${product.description}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Talla:</strong> ${product.size}</p>
          <p><strong>Precio:</strong> ${product.price}€</p>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product");
  }
};

const showNewProduct = (req, res) => {
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Dashboard - Nuevo producto</title>
      </head>
      <body style="font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 24px;">
        <a href="/dashboard">← Volver al dashboard</a>
        <h1>Nuevo producto</h1>

        <form action="/dashboard" method="POST" style="display:grid; gap:12px; max-width:520px;">
          <label>
            Nombre
            <input name="name" required />
          </label>

          <label>
            Descripción
            <textarea name="description" required></textarea>
          </label>

          <label>
            Imagen (URL)
            <input name="image" required />
          </label>

          <label>
            Categoría
            <select name="category" required>
              <option value="Camisetas">Camisetas</option>
              <option value="Pantalones">Pantalones</option>
              <option value="Zapatos">Zapatos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </label>

          <label>
            Talla
            <select name="size" required>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </label>

          <label>
            Precio (€)
            <input name="price" type="number" min="0" step="0.01" required />
          </label>

          <button type="submit">Crear producto</button>
        </form>
      </body>
    </html>
  `;

  res.send(html);
};

const createProduct = async (req, res) => {
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

    // después de crear, volvemos al dashboard (lista admin)
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating product");
  }
};

module.exports = {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
};
