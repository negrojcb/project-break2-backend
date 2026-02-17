const Product = require("../models/Product");
const mongoose = require("mongoose");
const baseHtml = require("../helpers/baseHtml");
const getNavBar = require("../helpers/getNavBar");

const showProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter).lean();

    const cards = products
      .map(
        (p) => `
        <div class="card">
          <img src="${p.image}" alt="${p.name}">
          <h2>${p.name}</h2>
          <p>${p.description}</p>
          <p class="price">${p.price}€</p>
          <a href="/products/${p._id}">Ver detalle</a>
        </div>
      `,
      )
      .join("");

    const content = `
      ${getNavBar({ active: category || "", isDashboard: false })}
      <main class="container">
        <h1>Productos</h1>
        ${products.length ? `<section class="grid">${cards}</section>` : "<p>No hay productos todavía.</p>"}
      </main>
    `;

    res.send(baseHtml({ title: "Tienda - Productos", body: content }));
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
    if (!product) return res.status(404).send("Product not found");

    const content = `
      ${getNavBar({ active: product.category, isDashboard: false })}
      <main class="container">
        <p><a href="/products">← Volver</a></p>
        <h1>${product.name}</h1>
        <div class="card card-narrow">
          <img src="${product.image}" alt="${product.name}">
          <p>${product.description}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Talla:</strong> ${product.size}</p>
          <p class="price">${product.price}€</p>
        </div>
      </main>
    `;

    res.send(baseHtml({ title: product.name, body: content }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product");
  }
};

const showNewProduct = (req, res) => {
  const content = `
    ${getNavBar({ isDashboard: true })}
    <main class="container">
      <p><a href="/dashboard">← Volver al dashboard</a></p>
      <h1>Nuevo producto</h1>

      <form action="/dashboard" method="POST" class="form">
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
    </main>
  `;

  res.send(baseHtml({ title: "Dashboard - Nuevo producto", body: content }));
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

const showDashboard = async (req, res) => {
  try {
    const products = await Product.find().lean();

    const rows = products
      .map(
        (p) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.size}</td>
          <td>${p.price}€</td>
          <td>
            <a href="/dashboard/${p._id}">Ver</a> |
            <a href="/dashboard/${p._id}/edit">Editar</a> |
            <form action="/dashboard/${p._id}/delete?_method=DELETE" method="POST" style="display:inline;">
              <button type="submit">Eliminar</button>
            </form>
          </td>
        </tr>
      `,
      )
      .join("");

    const content = `
      ${getNavBar({ isDashboard: true })}
      <main class="container">
        <h1>Dashboard</h1>

        ${
          products.length
            ? `
              <div class="card">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Talla</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              </div>
            `
            : "<p>No hay productos todavía.</p>"
        }
      </main>
    `;

    res.send(baseHtml({ title: "Dashboard", body: content }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
};

const showDashboardProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product id");
    }

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).send("Product not found");

    const content = `
      ${getNavBar({ isDashboard: true })}
      <main class="container">
        <p>
          <a href="/dashboard">← Volver al dashboard</a>
          | <a href="/products/${product._id}">Ver en tienda</a>
        </p>

        <h1>${product.name}</h1>

        <div class="card card-narrow">
          <img src="${product.image}" alt="${product.name}">
          <p>${product.description}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Talla:</strong> ${product.size}</p>
          <p class="price">${product.price}€</p>

          <p>
            <a href="/dashboard/${product._id}/edit">Editar</a>
          </p>

          <form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
            <button type="submit">Eliminar</button>
          </form>
        </div>
      </main>
    `;

    res.send(baseHtml({ title: `Dashboard - ${product.name}`, body: content }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard product");
  }
};

const showEditProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product id");
    }

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).send("Product not found");

    const CATEGORIES = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];
    const SIZES = ["XS", "S", "M", "L", "XL"];

    const categoryOptions = CATEGORIES.map(
      (c) =>
        `<option value="${c}" ${product.category === c ? "selected" : ""}>${c}</option>`,
    ).join("");

    const sizeOptions = SIZES.map(
      (s) =>
        `<option value="${s}" ${product.size === s ? "selected" : ""}>${s}</option>`,
    ).join("");

    const content = `
      ${getNavBar({ isDashboard: true })}
      <main class="container">
        <p><a href="/dashboard/${product._id}">← Volver</a></p>
        <h1>Editar producto</h1>

        <form action="/dashboard/${product._id}?_method=PUT" method="POST" class="form">
          <label>
            Nombre
            <input name="name" required value="${product.name}" />
          </label>

          <label>
            Descripción
            <textarea name="description" required>${product.description}</textarea>
          </label>

          <label>
            Imagen (URL)
            <input name="image" required value="${product.image}" />
          </label>

          <label>
            Categoría
            <select name="category" required>
              ${categoryOptions}
            </select>
          </label>

          <label>
            Talla
            <select name="size" required>
              ${sizeOptions}
            </select>
          </label>

          <label>
            Precio (€)
            <input name="price" type="number" min="0" step="0.01" required value="${product.price}" />
          </label>

          <button type="submit">Guardar cambios</button>
        </form>
      </main>
    `;

    res.send(baseHtml({ title: `Editar - ${product.name}`, body: content }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product id");
    }

    const { name, description, image, category, size, price } = req.body;

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        image,
        category,
        size,
        price: Number(price),
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updated) return res.status(404).send("Product not found");

    res.redirect(`/dashboard/${productId}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product id");
    }

    const deleted = await Product.findByIdAndDelete(productId).lean();
    if (!deleted) return res.status(404).send("Product not found");

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
};

module.exports = {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
  showDashboard,
  showDashboardProductById,
  showEditProduct,
  updateProduct,
  deleteProduct,
};
