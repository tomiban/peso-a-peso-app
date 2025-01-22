/*
  Warnings:

  - You are about to drop the column `type` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `categoryIcon` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,userId,isExpense]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Category_name_userId_type_key` ON `Category`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `type`,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `isExpense` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `monthlyBudget` DECIMAL(65, 30) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `icon` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `category`,
    DROP COLUMN `categoryIcon`,
    DROP COLUMN `description`,
    DROP COLUMN `type`,
    DROP COLUMN `userId`,
    ADD COLUMN `accountId` VARCHAR(191) NOT NULL,
    ADD COLUMN `attachments` VARCHAR(191) NULL,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `endRecurrencyDate` DATETIME(3) NULL,
    ADD COLUMN `frequency` ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NULL,
    ADD COLUMN `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `nextExecutionDate` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('COMPLETED', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    ALTER COLUMN `updatedAt` DROP DEFAULT,
    MODIFY `amount` DECIMAL(65, 30) NOT NULL;

-- DropTable
DROP TABLE `UserSettings`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'es',
    `notifications` BOOLEAN NOT NULL DEFAULT true,
    `currencyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Currency_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('CASH', 'BANK_ACCOUNT', 'CREDIT_CARD', 'SAVINGS', 'INVESTMENT') NOT NULL,
    `currencyId` VARCHAR(191) NOT NULL,
    `currentBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Account_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transfer` (
    `id` VARCHAR(191) NOT NULL,
    `fromAccountId` VARCHAR(191) NOT NULL,
    `toAccountId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `exchangeRate` DECIMAL(65, 30) NOT NULL DEFAULT 1,
    `date` DATETIME(3) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavingsGoal` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `targetAmount` DECIMAL(65, 30) NOT NULL,
    `currentAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `deadline` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentReminder` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `frequency` ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'NONE',
    `status` ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `categoryId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_userId_isExpense_key` ON `Category`(`name`, `userId`, `isExpense`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_fromAccountId_fkey` FOREIGN KEY (`fromAccountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_toAccountId_fkey` FOREIGN KEY (`toAccountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavingsGoal` ADD CONSTRAINT `SavingsGoal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentReminder` ADD CONSTRAINT `PaymentReminder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
