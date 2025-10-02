import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/models/index.js";

describe("Usuarios API", () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it("GET /usuarios devuelve array", async () => {
    const res = await request(app)
      .get("/usuarios")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /usuarios crea usuario", async () => {
    const res = await request(app)
      .post("/usuarios")
      .send({ nombre: "Test", email: "test@example.com" })
      .expect(201);
    expect(res.body?.id).toBeDefined();
    expect(res.body?.email).toBe("test@example.com");
  });
});
