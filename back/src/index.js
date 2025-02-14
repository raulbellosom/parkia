import app from "./app.js";

// Configurar Puerto
const PORT = process.env.PORT || 4000;

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
