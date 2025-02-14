import { authenticateUser } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authenticateUser(email, password);

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
