/*
  Warnings:

  - You are about to drop the `Parts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Parts` DROP FOREIGN KEY `Parts_maintenanceId_fkey`;

-- DropTable
DROP TABLE `Parts`;

-- CreateTable
CREATE TABLE `Component` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `partNumber` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Technician` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `licenseType` VARCHAR(191) NOT NULL,
    `certificationId` VARCHAR(191) NOT NULL,
    `expirationDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Technician_certificationId_key`(`certificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Component` ADD CONSTRAINT `Component_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
