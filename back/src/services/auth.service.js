import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto123";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// 🔐 Función para generar un JWT
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 🔑 Función para autenticar un usuario
export const authenticateUser = async (email, password) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Contraseña incorrecta");

  const token = generateToken(user);
  return { user, token };
};
