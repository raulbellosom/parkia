import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto123";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

export const restrictToCompany = async (req, res, next) => {
  try {
    const userAuth = req.user; // Usuario autenticado

    if (userAuth.rol === "ADMIN_GLOBAL") {
      return next(); // Admin Global puede ver todo
    }

    // Validar si se está accediendo a un usuario de otra empresa
    const userId = req.params.id || req.body.id;
    if (userId) {
      const user = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { empresaId: true },
      });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      if (user.empresaId !== userAuth.empresaId) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para acceder a este usuario" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error en la validación de acceso" });
  }
};
