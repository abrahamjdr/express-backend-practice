/**
 * @file Servicio de usuarios: lógica de negocio y transacciones.
 */
import { sequelize, User, Post } from "../models/index.js";
import { AppError } from "../middlewares/error.js";
/**
 * Crea un usuario y su primer post dentro de una transacción.
 * Si algo falla, se hace rollback automático.
 * @param {{nombre:string, email:string}} dataUsuario
 * @param {{titulo:string, contenido:string}} dataPost
 * @returns {Promise<{usuario:any, post:any}>}
 * @throws Error cuando alguna operación de BD falla
 */
export async function crearUsuarioConPost(dataUsuario, dataPost) {
  return sequelize.transaction(async (t) => {
    const usuario = await User.create(dataUsuario, { transaction: t });
    const post = await Post.create(
      { ...dataPost, userId: usuario.id },
      { transaction: t }
    );
    if (!usuario || !post) {
      throw new AppError("Datos incompletos", 400, "BUSINESS_RULE");
    }
    return { usuario, post };
  });
}
