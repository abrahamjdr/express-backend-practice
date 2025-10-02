import request from "supertest";
import app from "../src/app.js";

describe("Manejo de errores", () => {
  it("404: ruta no existe", async () => {
    const res = await request(app).get("/no-existe").expect(404);
    expect(res.body?.error?.code).toBe("NOT_FOUND");
  });

  it("400: validación Zod en POST /usuarios", async () => {
    const res = await request(app)
      .post("/usuarios")
      .send({ nombre: "", email: "no-es-email" })
      .expect(400);
    expect(res.body?.error?.code).toBe("ZOD_VALIDATION");
  });
});
