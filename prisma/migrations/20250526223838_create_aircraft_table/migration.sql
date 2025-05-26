-- CreateTable
CREATE TABLE `Maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `aircraftId` VARCHAR(191) NOT NULL,
    `serviceType` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `openedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_aircraftId_fkey` FOREIGN KEY (`aircraftId`) REFERENCES `Aircraft`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
