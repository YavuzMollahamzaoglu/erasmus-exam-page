-- CreateTable
CREATE TABLE `WordHuntQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `turkish` VARCHAR(191) NOT NULL,
    `english` VARCHAR(191) NOT NULL,
    `wrongOption` VARCHAR(191) NOT NULL,
    `alternatives` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WritingQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `turkish` VARCHAR(191) NOT NULL,
    `english` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParagraphQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `options` VARCHAR(191) NOT NULL,
    `correctAnswers` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
