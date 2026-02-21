require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const apiProductRoutes = require("./routes/apiProductRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use("/api", apiProductRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(authRoutes);

app.use(productRoutes);

app.get("/", (req, res) => {
  res.redirect("/products");
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
