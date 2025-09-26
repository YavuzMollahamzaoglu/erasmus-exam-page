/*
  Warnings:

  - You are about to drop the column `topics` on the `ExamPreview` table. All the data in the column will be lost.
  - Added the required column `alternatives` to the `ExamPreview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExamPreview` DROP COLUMN `topics`,
    ADD COLUMN `alternatives` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `ParagraphQuestion` MODIFY `text` TEXT NOT NULL,
    MODIFY `options` TEXT NOT NULL,
    MODIFY `correctAnswers` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Question` MODIFY `text` TEXT NOT NULL,
    MODIFY `options` TEXT NOT NULL,
    MODIFY `explanation` TEXT NOT NULL;
