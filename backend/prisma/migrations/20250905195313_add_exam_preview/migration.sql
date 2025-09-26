-- CreateTable
CREATE TABLE `ExamPreview` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NULL,
    `seriesId` VARCHAR(191) NULL,
    `total` INTEGER NOT NULL DEFAULT 0,
    `topics` JSON NULL,
    `grammar` JSON NULL,
    `difficulty` JSON NULL,
    `gains` JSON NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'heuristic',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExamPreview_categoryId_idx`(`categoryId`),
    INDEX `ExamPreview_seriesId_idx`(`seriesId`),
    UNIQUE INDEX `ExamPreview_categoryId_seriesId_key`(`categoryId`, `seriesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
