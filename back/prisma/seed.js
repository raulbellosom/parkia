import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Ejecutando Seeder...");

  const fakeEmpresaUUID = "empresa-ejemplo-uuid";
  // 1️⃣ Crear o recuperar Empresa Ejemplo
  const empresaEjemplo = await prisma.empresa.upsert({
    where: { id: fakeEmpresaUUID },
    update: {},
    create: {
      id: fakeEmpresaUUID,
      nombre: "Empresa Ejemplo",
      direccion: "Calle Falsa 123",
      telefono: "555-1234",
      email: "contacto@empresa.com",
    },
  });

  // 2️⃣ Crear Administrador Global (sin empresa)
  const adminGlobal = await prisma.usuario.upsert({
    where: { email: "admin@parkia.com" },
    update: {},
    create: {
      nombre: "Administrador Global",
      email: "admin@parkia.com",
      password: await bcrypt.hash("admin123", 10),
      rol: "ADMIN_GLOBAL",
      empresaId: fakeEmpresaUUID,
    },
  });

  // 🔥 **Solución: Recuperar el ID de la empresa antes de crear el usuario**
  const empresa = await prisma.empresa.findUnique({
    where: { id: "empresa-ejemplo-uuid" },
  });

  if (!empresa) {
    throw new Error("❌ Error: La empresa no fue creada correctamente.");
  }

  // 3️⃣ Crear Usuario Administrador de Empresa con el `empresaId` correcto
  const adminEmpresa = await prisma.usuario.upsert({
    where: { email: "admin.empresa@parkia.com" },
    update: {},
    create: {
      nombre: "Admin Empresa",
      email: "admin.empresa@parkia.com",
      password: await bcrypt.hash("empresa123", 10),
      rol: "ADMIN_EMPRESA",
      empresaId: empresa.id, // ✅ Ahora estamos seguros de que `empresaId` tiene un valor válido
    },
  });

  console.log("✅ Seeder ejecutado correctamente.");
}

// Ejecutar el Seeder
main()
  .catch((error) => {
    console.error("❌ Error al ejecutar el seeder:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
