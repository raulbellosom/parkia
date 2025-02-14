-- CreateTable
CREATE TABLE `Empresa` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `direccion` TEXT NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `rol` ENUM('ADMIN_GLOBAL', 'ADMIN_EMPRESA', 'SECRETARIA', 'CHOFER') NOT NULL,
    `empresaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChoferDetalle` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `CURP` VARCHAR(18) NOT NULL,
    `numLicencia` VARCHAR(50) NOT NULL,
    `tarjetaCirculacion` VARCHAR(50) NULL,
    `fechaIngreso` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ChoferDetalle_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehiculo` (
    `id` VARCHAR(191) NOT NULL,
    `empresaId` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(255) NOT NULL,
    `marca` VARCHAR(255) NOT NULL,
    `placa` VARCHAR(50) NOT NULL,
    `año` INTEGER NOT NULL,
    `tipo` ENUM('CATEGORIA_G', 'CATEGORIA_M') NOT NULL,
    `estado` ENUM('DISPONIBLE', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Vehiculo_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AsignacionChoferVehiculo` (
    `id` VARCHAR(191) NOT NULL,
    `choferId` VARCHAR(191) NOT NULL,
    `vehiculoId` VARCHAR(191) NOT NULL,
    `fechaAsignacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroActividadVehiculo` (
    `id` VARCHAR(191) NOT NULL,
    `vehiculoId` VARCHAR(191) NOT NULL,
    `evento` TEXT NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TarjetaRecarga` (
    `id` VARCHAR(191) NOT NULL,
    `vehiculoId` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `categoria` ENUM('CATEGORIA_G', 'CATEGORIA_M') NOT NULL,
    `saldo` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TarjetaRecarga_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackerViajes` (
    `id` VARCHAR(191) NOT NULL,
    `choferId` VARCHAR(191) NOT NULL,
    `vehiculoId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('RECOGIDA', 'ABORDAJE') NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaFin` DATETIME(3) NULL,
    `solicitudCancelacion` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventoOperativo` (
    `id` VARCHAR(191) NOT NULL,
    `tripId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('LLEGADA_ESTACIONAMIENTO', 'SALIDA_ESTACIONAMIENTO', 'CHECKPOINT_CLIENTES') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Archivo` (
    `id` VARCHAR(191) NOT NULL,
    `entidad` ENUM('USUARIO', 'VEHICULO', 'EMPRESA', 'RECARGA') NOT NULL,
    `referenciaId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `tipo` ENUM('DOCUMENTO', 'SEGURO', 'FACTURA', 'RECIBO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imagen` (
    `id` VARCHAR(191) NOT NULL,
    `entidad` ENUM('USUARIO', 'VEHICULO', 'EMPRESA', 'CHOFER') NOT NULL,
    `referenciaId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `urlThumb` TEXT NOT NULL,
    `tipo` ENUM('PERFIL', 'LICENCIA_FRENTE', 'LICENCIA_REVERSO', 'LOGO', 'GENERALES_VEHICULOS') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChoferDetalle` ADD CONSTRAINT `ChoferDetalle_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionChoferVehiculo` ADD CONSTRAINT `AsignacionChoferVehiculo_choferId_fkey` FOREIGN KEY (`choferId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionChoferVehiculo` ADD CONSTRAINT `AsignacionChoferVehiculo_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroActividadVehiculo` ADD CONSTRAINT `RegistroActividadVehiculo_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroActividadVehiculo` ADD CONSTRAINT `RegistroActividadVehiculo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TarjetaRecarga` ADD CONSTRAINT `TarjetaRecarga_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackerViajes` ADD CONSTRAINT `TrackerViajes_choferId_fkey` FOREIGN KEY (`choferId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackerViajes` ADD CONSTRAINT `TrackerViajes_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventoOperativo` ADD CONSTRAINT `EventoOperativo_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `TrackerViajes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
