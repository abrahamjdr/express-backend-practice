/**
 * @file Define el modelo User.
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {import('sequelize').Model}
 */
export default function defineUser(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
  return User;
}
