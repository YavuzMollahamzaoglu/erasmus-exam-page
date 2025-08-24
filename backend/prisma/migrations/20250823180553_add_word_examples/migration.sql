-- CreateTable
CREATE TABLE `WordExample` (
    `id` VARCHAR(191) NOT NULL,
    `wordId` VARCHAR(191) NOT NULL,
    `sentence` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WordExample` ADD CONSTRAINT `WordExample_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
