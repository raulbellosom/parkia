import multer from "multer";
import path from "path";
import fs from "fs";

// Definir carpeta según TipoImagen
const getImageFolder = (tipo) => {
  const baseDir = "uploads/";
  const folders = {
    PERFIL: "usuarios/",
    LICENCIA_FRENTE: "licencias/",
    LICENCIA_REVERSO: "licencias/",
    LOGO: "empresas/",
    GENERALES_VEHICULOS: "vehiculos/",
  };
  return baseDir + (folders[tipo] || "otros/");
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.body.tipoImagen || "otros";
    const folder = getImageFolder(tipo);

    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

// Configurar Multer
const upload = multer({ storage, fileFilter });

export default upload;
