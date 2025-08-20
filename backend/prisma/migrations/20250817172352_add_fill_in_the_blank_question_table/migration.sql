-- CreateTable
CREATE TABLE `FillInTheBlankQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `options` TEXT NOT NULL,
    `correctAnswers` TEXT NOT NULL,
    `explanation` TEXT NULL,
    `level` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
