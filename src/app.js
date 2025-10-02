/**
 * @file App de Express
 */
import express from "express";
import { requestId } from "./middlewares/requestId.js";
import { errorConverter, errorHandler, notFound } from "./middlewares/error.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(requestId);
app.use(express.json());

// Ruta de salud
app.get("/", (_req, res) => res.json({ ok: true, service: "api" }));

// Rutas de usuarios
app.use("/usuarios", userRoutes);

// 404 si no matchea ninguna ruta
app.use(notFound);

// Convertidor → Handler final
app.use(errorConverter);
app.use(errorHandler);

export default app;
