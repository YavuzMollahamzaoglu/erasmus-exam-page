/*
  Warnings:

  - You are about to drop the `FillInTheBlankQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `FillInTheBlankQuestion`;

-- CreateTable
CREATE TABLE `Word` (
    `id` VARCHAR(191) NOT NULL,
    `english` VARCHAR(191) NOT NULL,
    `turkish` VARCHAR(191) NOT NULL,
    `example` VARCHAR(191) NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `categoryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Word` ADD CONSTRAINT `Word_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
