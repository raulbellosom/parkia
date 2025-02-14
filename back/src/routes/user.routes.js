import { Router } from "express";
import {
  getUsers,
  getUser,
  createNewUser,
  updateUserById,
  deleteUserById,
  searchUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { restrictToCompany } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 Aplicar seguridad a todas las rutas
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, restrictToCompany, getUser);
router.post("/", verifyToken, restrictToCompany, createNewUser);
router.put("/:id", verifyToken, restrictToCompany, updateUserById);
router.delete("/:id", verifyToken, restrictToCompany, deleteUserById);
router.get("/search", verifyToken, searchUsers);

export default router;
