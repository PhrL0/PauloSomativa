/*
  Warnings:

  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Part` DROP FOREIGN KEY `Part_maintenanceId_fkey`;

-- DropTable
DROP TABLE `Part`;

-- CreateTable
CREATE TABLE `Parts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `partNumber` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Parts` ADD CONSTRAINT `Parts_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
