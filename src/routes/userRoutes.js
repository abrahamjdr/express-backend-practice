/**
 * @file Define rutas HTTP para usuarios.
 */
import { Router } from "express";
import userController from "../controllers/userController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate, crearUsuarioSchema } from "../middlewares/validate.js";
import { pagination } from "../middlewares/pagination.js";
const router = Router();

router.get(
  "/",
  pagination({ page: 1, limit: 10, maxLimit: 100 }),
  asyncHandler(userController.obtenerUsuarios)
);
router.get("/:id", asyncHandler(userController.obtenerUsuarioPorId));
// Valida body con zod; si falla, errorConverter devolverá 400 bonito
router.post(
  "/",
  validate(crearUsuarioSchema),
  asyncHandler(userController.crearUsuario)
);
router.post(
  "/with-post",
  asyncHandler(userController.crearUsuarioConPublicacion)
);
router.put("/:id", asyncHandler(userController.actualizarUsuario));
router.delete("/:id", asyncHandler(userController.eliminarUsuario));

export default router;
