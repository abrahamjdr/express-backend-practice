// jest.config.js (ESM)
export default {
  testEnvironment: "node",
  // No usamos Babel: todo es Node ESM nativo
  transform: {},
  // Trata .js como módulos ESM (porque tu package.json tiene "type":"module")
  // Opcional: silenciar warnings de ESM en dependencias si hiciera falta
  // moduleFileExtensions: ['js', 'json'],
};
