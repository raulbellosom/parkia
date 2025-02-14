import prisma from "../config/db.js";

// 🔹 Guardar Imagen en la Base de Datos
export const saveImage = async (entidad, referenciaId, url, tipo) => {
  return await prisma.imagen.create({
    data: { entidad, referenciaId, url, tipo },
  });
};

// 🔹 Obtener imágenes por entidad
export const getImagesByReference = async (referenciaId) => {
  return await prisma.imagen.findMany({
    where: { referenciaId },
  });
};

// 🔹 Eliminar imagen
export const deleteImage = async (id) => {
  return await prisma.imagen.delete({ where: { id } });
};
