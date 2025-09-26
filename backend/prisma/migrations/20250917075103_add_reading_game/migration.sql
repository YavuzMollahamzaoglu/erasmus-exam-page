-- CreateTable
CREATE TABLE `ReadingPassage` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReadingQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `passageId` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `options` TEXT NOT NULL,
    `correctIndex` INTEGER NOT NULL,
    `explanation` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReadingQuestion` ADD CONSTRAINT `ReadingQuestion_passageId_fkey` FOREIGN KEY (`passageId`) REFERENCES `ReadingPassage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
