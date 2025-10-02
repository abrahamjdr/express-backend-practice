import { z } from "zod";

/** Ejemplos de esquemas */
export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, "nombre requerido"),
  email: z.string().email("email inválido"),
});

export function validate(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      // Lanzamos error; errorConverter lo capturará como ZodError
      parsed.error.name = "ZodError";
      return next(parsed.error);
    }
    // Sustituimos por datos validados (sanitizados)
    req.body = parsed.data;
    next();
  };
}
