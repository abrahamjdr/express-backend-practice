import "dotenv/config";
import app from "./src/app.js";
import { syncDb } from "./src/models/index.js";

const PORT = process.env.PORT || 3000;

await syncDb(); // crea/ajusta tablas antes de arrancar

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
