import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { saveImage, deleteImage } from "../services/image.service.js";
import prisma from "../config/db.js";

// 🔍 Obtener lista de usuarios restringida por empresa
export const getUsers = async (req, res) => {
  try {
    const userAuth = req.user;

    const filters =
      userAuth.rol === "ADMIN_GLOBAL" ? {} : { empresaId: userAuth.empresaId };

    const users = await prisma.usuario.findMany({
      where: filters,
      include: { empresa: { select: { nombre: true } } },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🔹 Obtener usuario por ID con validación de empresa
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// 🔹 Crear usuario con validación de empresa
export const createNewUser = async (req, res) => {
  try {
    const userAuth = req.user;
    const { nombre, email, password, rol } = req.body;

    const user = await createUser({
      nombre,
      email,
      password,
      rol,
      empresaId: userAuth.empresaId, // Asegurar que el usuario pertenece a la empresa correcta
    });

    if (req.file) {
      await saveImage("USUARIO", user.id, req.file.path, "PERFIL");
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// 🔹 Actualizar usuario con validación de empresa
export const updateUserById = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.id;

    if (req.file) {
      const oldImages = await getImagesByReference(userId);
      if (oldImages.length > 0) {
        await deleteImage(oldImages[0].id);
      }
      await saveImage("USUARIO", userId, req.file.path, "PERFIL");
    }

    const updatedUser = await updateUser(userId, data);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// 🔹 Eliminar usuario con validación de empresa
export const deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// 🔍 Búsqueda avanzada con seguridad
export const searchUsers = async (req, res) => {
  try {
    const {
      query = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      rol,
    } = req.query;
    const userAuth = req.user;

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const filters = {
      OR: [
        { nombre: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };

    if (rol) filters.rol = rol;

    if (userAuth.rol !== "ADMIN_GLOBAL") {
      filters.empresaId = userAuth.empresaId;
    }

    if (rol === "CHOFER") {
      filters.OR.push(
        { choferDetalle: { CURP: { contains: query, mode: "insensitive" } } },
        {
          choferDetalle: {
            numLicencia: { contains: query, mode: "insensitive" },
          },
        }
      );
    }

    const users = await prisma.usuario.findMany({
      where: filters,
      include: {
        empresa: { select: { nombre: true } },
        choferDetalle: rol === "CHOFER" ? true : false,
      },
      orderBy: {
        [sortBy]: order.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: pageSize,
    });

    const totalUsers = await prisma.usuario.count({ where: filters });

    res.json({
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(totalUsers / pageSize),
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};
