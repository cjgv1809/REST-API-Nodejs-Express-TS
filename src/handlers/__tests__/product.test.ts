import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  it("should return 400 if the request body is empty", async () => {
    const response = await request(server).post("/api/products").send({});

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Product 1",
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Price must be greater than 0");
  });

  it("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Product 1",
      price: "Hey there! I am a string",
    });

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors[0].msg).toBe("Price must be a number");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should create a new product", async () => {
    const response = await request(server)
      .post("/api/products")
      .send({ name: "Product 1", price: 100, availability: true });

    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("GET /api/products", () => {
  it("should check if api/products route exists", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
  });

  it("should return an empty array if no products are found", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    // expect(response.body.data).toHaveLength(0); // clear db before running this test

    expect(response.body).not.toHaveProperty("error");
  });

  it("should return all products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.body).not.toHaveProperty("error");
  });
});

describe("GET /api/products/:id", () => {
  it("should return 404 if the product is not found", async () => {
    const response = await request(server).get("/api/products/123");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(500);
  });

  it("should have a valid id", async () => {
    const response = await request(server).get("/api/products/abc");

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toEqual("Product ID must be a number");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
  });

  it("should return a product if it exists", async () => {
    const response = await request(server).get("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.body).not.toHaveProperty("error");
  });
});

describe("PUT /api/products/:id", () => {
  it("should have a valid id", async () => {
    const response = await request(server).put("/api/products/abc").send({});

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toEqual("Product ID must be a number");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
  });

  it("should return 400 if the request body is empty", async () => {
    const response = await request(server).put("/api/products/1").send({});

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(6);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Product 1",
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors[0].msg).toBe("Price must be greater than 0");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should return 404 if the product is not found", async () => {
    const response = await request(server).put("/api/products/123").send({
      name: "Product 1",
      price: 100,
      availability: true,
    });

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(500);
  });

  it("should update a product if it exists", async () => {
    const response = await request(server)
      .put("/api/products/1")
      .send({ name: "Product 1", price: 100, availability: true });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.body).not.toHaveProperty("error");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should have a valid id", async () => {
    const response = await request(server).patch("/api/products/abc").send({});

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toEqual("Product ID must be a number");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
  });

  it("should return 404 if the product is not found", async () => {
    const response = await request(server).patch("/api/products/123");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(500);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should update a product availability", async () => {
    const response = await request(server).patch("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/:id", () => {
  it("should return 404 if the product is not found", async () => {
    const response = await request(server).delete("/api/products/123");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(500);
  });

  it("should have a valid id", async () => {
    const response = await request(server).delete("/api/products/abc");

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toEqual("Product ID must be a number");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(500);
  });

  it("should delete a product if it exists", async () => {
    const response = await request(server).delete("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Product deleted");

    expect(response.body).not.toHaveProperty("error");
  });
});
