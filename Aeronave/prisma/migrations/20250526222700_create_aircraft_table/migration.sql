-- CreateTable
CREATE TABLE `Aircraft` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `flightHours` VARCHAR(191) NOT NULL,
    `serialNumber` INTEGER NOT NULL,

    UNIQUE INDEX `Aircraft_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
