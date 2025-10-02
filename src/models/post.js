/**
 * @file Define el modelo Post (Publicación).
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {import('sequelize').Model}
 */
export default function definePost(sequelize, DataTypes) {
  const Post = sequelize.define("Post", {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Post;
}
