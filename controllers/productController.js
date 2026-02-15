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

const showDashboard = async (req, res) => {
  try {
    const products = await Product.find().lean();

    let rows = "";
    for (const p of products) {
      rows += `
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
      `;
    }

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Dashboard</title>
        </head>
        <body style="font-family: system-ui; max-width: 1000px; margin: 0 auto; padding: 24px;">
          <h1>Dashboard</h1>
          <p><a href="/dashboard/new">Crear nuevo producto</a> | <a href="/products">Ver tienda</a></p>

          ${
            products.length
              ? `
                <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
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
              `
              : "<p>No hay productos todavía.</p>"
          }
        </body>
      </html>
    `;

    res.send(html);
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

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Dashboard - ${product.name}</title>
        </head>
        <body style="font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 24px;">
          <p><a href="/dashboard">← Volver al dashboard</a> | <a href="/products/${product._id}">Ver en tienda</a></p>

          <h1>${product.name}</h1>
          <img src="${product.image}" alt="${product.name}" style="max-width:400px; display:block;" />
          <p>${product.description}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Talla:</strong> ${product.size}</p>
          <p><strong>Precio:</strong> ${product.price}€</p>

          <hr />

          <p>
            <a href="/dashboard/${product._id}/edit">Editar</a>
          </p>

          <form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
            <button type="submit">Eliminar</button>
          </form>
        </body>
      </html>
    `;

    res.send(html);
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

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Editar - ${product.name}</title>
        </head>
        <body style="font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 24px;">
          <a href="/dashboard/${product._id}">← Volver</a>
          <h1>Editar producto</h1>

          <form action="/dashboard/${product._id}?_method=PUT" method="POST" style="display:grid; gap:12px; max-width:520px;">
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
                <option value="Camisetas" ${product.category === "Camisetas" ? "selected" : ""}>Camisetas</option>
                <option value="Pantalones" ${product.category === "Pantalones" ? "selected" : ""}>Pantalones</option>
                <option value="Zapatos" ${product.category === "Zapatos" ? "selected" : ""}>Zapatos</option>
                <option value="Accesorios" ${product.category === "Accesorios" ? "selected" : ""}>Accesorios</option>
              </select>
            </label>

            <label>
              Talla
              <select name="size" required>
                <option value="XS" ${product.size === "XS" ? "selected" : ""}>XS</option>
                <option value="S" ${product.size === "S" ? "selected" : ""}>S</option>
                <option value="M" ${product.size === "M" ? "selected" : ""}>M</option>
                <option value="L" ${product.size === "L" ? "selected" : ""}>L</option>
                <option value="XL" ${product.size === "XL" ? "selected" : ""}>XL</option>
              </select>
            </label>

            <label>
              Precio (€)
              <input name="price" type="number" min="0" step="0.01" required value="${product.price}" />
            </label>

            <button type="submit">Guardar cambios</button>
          </form>
        </body>
      </html>
    `;

    res.send(html);
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
