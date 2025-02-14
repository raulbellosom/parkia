import prisma from "../config/db.js";

export const getAllUsers = async () => {
  return await prisma.usuario.findMany({
    include: { empresa: true },
  });
};

export const getUserById = async (id) => {
  return await prisma.usuario.findUnique({
    where: { id },
    include: { empresa: true },
  });
};

export const createUser = async (data) => {
  return await prisma.usuario.create({
    data,
  });
};

export const updateUser = async (id, data) => {
  return await prisma.usuario.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id) => {
  return await prisma.usuario.delete({
    where: { id },
  });
};
