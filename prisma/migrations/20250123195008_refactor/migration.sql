/*
  Warnings:

  - You are about to drop the column `frequency` on the `PaymentReminder` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `endRecurrencyDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `nextExecutionDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to drop the column `currencyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinancialAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FinancialAccount` DROP FOREIGN KEY `FinancialAccount_currencyId_fkey`;

-- DropForeignKey
ALTER TABLE `FinancialAccount` DROP FOREIGN KEY `FinancialAccount_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `Transfer` DROP FOREIGN KEY `Transfer_fromAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `Transfer` DROP FOREIGN KEY `Transfer_toAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_currencyId_fkey`;

-- DropIndex
DROP INDEX `Transaction_accountId_fkey` ON `Transaction`;

-- DropIndex
DROP INDEX `User_currencyId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `PaymentReminder` DROP COLUMN `frequency`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `accountId`,
    DROP COLUMN `endRecurrencyDate`,
    DROP COLUMN `frequency`,
    DROP COLUMN `nextExecutionDate`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `amount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `currencyId`;

-- DropTable
DROP TABLE `Currency`;

-- DropTable
DROP TABLE `FinancialAccount`;

-- DropTable
DROP TABLE `Transfer`;

-- CreateTable
CREATE TABLE `UserSettings` (
    `userId` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Budget` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Budget_userId_idx`(`userId`),
    INDEX `Budget_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `Budget_userId_categoryId_period_key`(`userId`, `categoryId`, `period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `MonthHistory_userId_year_month_day_idx` ON `MonthHistory`(`userId`, `year`, `month`, `day`);

-- CreateIndex
CREATE INDEX `PaymentReminder_categoryId_idx` ON `PaymentReminder`(`categoryId`);

-- CreateIndex
CREATE INDEX `Transaction_userId_idx` ON `Transaction`(`userId`);

-- CreateIndex
CREATE INDEX `YearHistory_userId_year_month_idx` ON `YearHistory`(`userId`, `year`, `month`);

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentReminder` ADD CONSTRAINT `PaymentReminder_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Category` RENAME INDEX `Category_userId_fkey` TO `Category_userId_idx`;

-- RenameIndex
ALTER TABLE `PaymentReminder` RENAME INDEX `PaymentReminder_userId_fkey` TO `PaymentReminder_userId_idx`;

-- RenameIndex
ALTER TABLE `SavingsGoal` RENAME INDEX `SavingsGoal_userId_fkey` TO `SavingsGoal_userId_idx`;

-- RenameIndex
ALTER TABLE `Transaction` RENAME INDEX `Transaction_categoryId_fkey` TO `Transaction_categoryId_idx`;
