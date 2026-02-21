const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tienda de ropa API",
    version: "1.0.0",
    description: "Documentación de la API JSON de productos",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local",
    },
    {
      url: "https://project-break2-backend.onrender.com",
      description: "Production",
    },
  ],
  tags: [
    {
      name: "Products",
      description: "Operaciones CRUD de productos",
    },
  ],
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67d123abc4567890ef123456" },
          name: { type: "string", example: "Camiseta básica" },
          description: { type: "string", example: "Algodón 100%" },
          image: {
            type: "string",
            example: "https://via.placeholder.com/600x400",
          },
          category: {
            type: "string",
            enum: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
            example: "Camisetas",
          },
          size: {
            type: "string",
            enum: ["XS", "S", "M", "L", "XL"],
            example: "M",
          },
          price: { type: "number", example: 19.99 },
        },
        required: ["name", "description", "image", "category", "size", "price"],
      },
      ProductInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Camiseta API" },
          description: { type: "string", example: "Creada desde Swagger" },
          image: {
            type: "string",
            example: "https://via.placeholder.com/600x400",
          },
          category: {
            type: "string",
            enum: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
            example: "Camisetas",
          },
          size: {
            type: "string",
            enum: ["XS", "S", "M", "L", "XL"],
            example: "M",
          },
          price: { type: "number", example: 19.99 },
        },
        required: ["name", "description", "image", "category", "size", "price"],
      },
    },
  },
  paths: {
    "/api/products": {
      get: {
        summary: "Obtener lista de productos",
        description:
          "Devuelve todos los productos. Permite filtrar por categoría.",
        tags: ["Products"],
        parameters: [
          {
            in: "query",
            name: "category",
            required: false,
            schema: {
              type: "string",
              enum: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
            },
            description: "Filtra productos por categoría",
          },
        ],
        responses: {
          200: {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
          },
        },
      },
      post: {
        summary: "Crear producto",
        description: "Crea un nuevo producto y lo devuelve en formato JSON.",
        tags: ["Products"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Producto creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: {
            description: "Error creating product",
          },
        },
      },
    },
    "/api/products/{productId}": {
      get: {
        summary: "Obtener producto por ID",
        description: "Devuelve el detalle de un producto por su ID.",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: { type: "string" },
            description: "ID de MongoDB del producto",
          },
        ],
        responses: {
          200: {
            description: "Producto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: {
            description: "Invalid product id",
          },
          404: {
            description: "Product not found",
          },
          500: {
            description: "Error interno del servidor",
          },
        },
      },
      put: {
        summary: "Actualizar producto",
        description:
          "Actualiza un producto por ID y devuelve el producto actualizado.",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: { type: "string" },
            description: "ID de MongoDB del producto",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Producto actualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: {
            description: "Invalid product id / Error updating product",
          },
          404: {
            description: "Product not found",
          },
        },
      },
      delete: {
        summary: "Eliminar producto",
        description: "Elimina un producto por ID.",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: { type: "string" },
            description: "ID de MongoDB del producto",
          },
        ],
        responses: {
          200: {
            description: "Producto eliminado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deleted: { type: "boolean", example: true },
                    id: { type: "string", example: "67d123abc4567890ef123456" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid product id",
          },
          404: {
            description: "Product not found",
          },
          500: {
            description: "Error deleting product",
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [], // no usamos comentarios @swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
