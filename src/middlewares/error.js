/**
 * AppError: errores controlados con status + código + detalles opcionales.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Mensaje de error legible.
   * @param {number} statusCode - HTTP status (ej. 400, 404, 409, 500).
   * @param {string} [code] - Código corto interno (ej. 'VALIDATION_ERROR').
   * @param {any} [details] - Datos extra (validaciones, etc).
   */
  constructor(message, statusCode = 500, code = "APP_ERROR", details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Traduce errores de Sequelize a AppError con status adecuados.
 */
function fromSequelize(err) {
  const name = err?.name;

  // Validaciones de modelo
  if (
    name === "SequelizeValidationError" ||
    name === "SequelizeUniqueConstraintError"
  ) {
    // Unique → 409 Conflict; Validation → 400 Bad Request
    const isUnique = name === "SequelizeUniqueConstraintError";
    const status = isUnique ? 409 : 400;
    const code = isUnique ? "UNIQUE_VIOLATION" : "MODEL_VALIDATION";
    const details =
      err.errors?.map((e) => ({
        message: e.message,
        path: e.path,
        value: e.value,
        type: e.validatorKey,
      })) || undefined;
    return new AppError(err.message, status, code, details);
  }

  // Otros (FK, etc.)
  if (name?.startsWith("Sequelize")) {
    return new AppError(err.message, 400, name, {
      original: err.parent?.message,
    });
  }

  return null;
}

/**
 * Convierte cualquier error a AppError para un manejo uniforme.
 * Si ya es AppError, lo deja igual; si es Sequelize, lo adapta; si no, 500.
 */
export function errorConverter(err, _req, _res, next) {
  if (err instanceof AppError) return next(err);

  const sequelizeMapped = fromSequelize(err);
  if (sequelizeMapped) return next(sequelizeMapped);

  // zod/celebrate/express-validator (ejemplos comunes)
  if (err?.name === "ZodError") {
    return next(
      new AppError(
        "Body inválido",
        400,
        "ZOD_VALIDATION",
        err.format?.() || err.issues
      )
    );
  }

  // Por defecto: 500
  const status = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const appErr = new AppError(err.message || "Error interno", status, code);
  return next(appErr);
}

/**
 * Manejador final de errores: responde en JSON.
 * - En dev incluye stack; en prod, stack omitido.
 */
export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const payload = {
    ok: false,
    error: {
      message: err.message || "Error interno",
      code: err.code || "INTERNAL_ERROR",
      status,
      requestId: req.id,
      details: err.details,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    payload.error.stack = err.stack;
  }

  // Log rápido al servidor
  console.error(`[${req.id}]`, err);

  res.status(status).json(payload);
}

/**
 * 404 handler: si ninguna ruta respondió, lanzamos AppError 404.
 */
export function notFound(_req, _res, next) {
  next(new AppError("Recurso no encontrado", 404, "NOT_FOUND"));
}
