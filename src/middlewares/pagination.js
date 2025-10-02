/**
 * Lee ?page, ?limit y ?sort de la query y las convierte en opciones para Sequelize.
 * - page: número de página (>=1). Default 1.
 * - limit: ítems por página (1..100). Default 10.
 * - sort: campos separados por coma. Prefijo "-" = DESC, sin prefijo = ASC.
 *         Ej: "createdAt,-nombre"  =>  ORDER BY createdAt ASC, nombre DESC
 *
 * Deja en req.pagination: { page, limit, offset, order }
 */
export function pagination(defaults = { page: 1, limit: 10, maxLimit: 100 }) {
  return (req, _res, next) => {
    const rawPage = Number(req.query.page ?? defaults.page);
    const rawLimit = Number(req.query.limit ?? defaults.limit);
    const maxLimit = defaults.maxLimit ?? 100;

    const page =
      Number.isFinite(rawPage) && rawPage > 0
        ? Math.floor(rawPage)
        : defaults.page;
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(Math.floor(rawLimit), maxLimit)
        : defaults.limit;
    const offset = (page - 1) * limit;

    // sort = "campo" | "-campo" | "campoA,-campoB,..."  → [['campoA','ASC'], ['campoB','DESC']]
    const sortParam = (req.query.sort ?? "").toString().trim();
    let order = [["createdAt", "DESC"]]; // default razonable
    if (sortParam) {
      order = sortParam
        .split(",")
        .map((token) => {
          const t = token.trim();
          if (!t) return null;
          if (t.startsWith("-")) return [t.slice(1), "DESC"];
          return [t, "ASC"];
        })
        .filter(Boolean);
    }

    req.pagination = { page, limit, offset, order };
    next();
  };
}
