import { randomUUID } from "node:crypto";

/**
 * Agrega un ID único por request para correlación en logs.
 */
export function requestId(req, _res, next) {
  req.id = req.headers["x-request-id"] || randomUUID();
  next();
}
