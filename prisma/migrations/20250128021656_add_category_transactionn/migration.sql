/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `PaymentReminder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PaymentReminder` DROP FOREIGN KEY `PaymentReminder_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentReminder` DROP FOREIGN KEY `PaymentReminder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_categoryId_fkey`;

-- DropIndex
DROP INDEX `Transaction_categoryId_idx` ON `Transaction`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `categoryId`,
    DROP COLUMN `status`,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `categoryIcon` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `PaymentReminder`;
