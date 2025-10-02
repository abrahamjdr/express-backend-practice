// src/models/index.js
/**
 * Inicializa Sequelize con SQLite y registra los modelos y asociaciones.
 * @module models/index
 */
import { Sequelize, DataTypes } from "sequelize";
import defineUser from "./user.js";
import definePost from "./post.js";

// Crear instancia de Sequelize con SQLite (archivo local database.sqlite)
const databaseUrl = process.env.DATABASE_URL || "sqlite:database.sqlite";
console.log({ databaseUrl });
export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // Supabase: SSL requerido
      rejectUnauthorized: false,
    },
  },
});

// Definir modelos
export const User = defineUser(sequelize, DataTypes);
export const Post = definePost(sequelize, DataTypes);

// Asociaciones: 1:N -> User tiene muchas Post; Post pertenece a User
User.hasMany(Post, { as: "publicaciones", foreignKey: "userId" });
Post.belongsTo(User, { as: "autor", foreignKey: "userId" });

/**
 * Sincroniza modelos con la base de datos.
 * En dev usamos alter:true para ajustar cambios menores.
 * @returns {Promise<void>}
 */
export async function syncDb() {
  await sequelize.sync({ alter: true });
}
