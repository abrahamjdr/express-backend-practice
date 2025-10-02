/**
 * Envuélvelo alrededor de controladores async para capturar errores y pasarlos a next(err).
 * Evita repetir try/catch en cada controlador.
 * @param {(req,res,next)=>Promise<any>} fn
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
