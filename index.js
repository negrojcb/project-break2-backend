require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(productRoutes);

app.get("/", (req, res) => {
  res.redirect("/products");
});

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
