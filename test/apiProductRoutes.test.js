const request = require("supertest");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const app = require("../index");

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI);
});
afterAll(async () => {
  await mongoose.connection.close();
});

let createdProductId;

describe("API Products", () => {
  test("GET /api/products should return 200", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("POST /api/products should return 201 and create a product", async () => {
    const payload = {
      name: "Test Product Jest",
      description: "Created by test",
      image: "https://via.placeholder.com/600x400",
      category: "Camisetas",
      size: "M",
      price: 20,
    };

    const res = await request(app).post("/api/products").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe(payload.name);
    createdProductId = res.body._id;
  });
  test("PUT /api/products/:id should update a product", async () => {
    const payload = {
      name: "Test Product Jest Updated",
      description: "Updated by test",
      image: "https://via.placeholder.com/600x400",
      category: "Camisetas",
      size: "L",
      price: 25,
    };

    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe(payload.name);
    expect(res.body.size).toBe("L");
  });
  test("DELETE /api/products/:id should delete a product", async () => {
    const res = await request(app).delete(`/api/products/${createdProductId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      deleted: true,
      id: createdProductId,
    });
  });
});
