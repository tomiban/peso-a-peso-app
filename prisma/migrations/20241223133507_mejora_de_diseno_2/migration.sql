/*
  Warnings:

  - You are about to drop the column `exchangeRate` on the `Transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MonthHistory` MODIFY `income` DECIMAL(15, 2) NOT NULL,
    MODIFY `expense` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Transfer` DROP COLUMN `exchangeRate`;

-- AlterTable
ALTER TABLE `YearHistory` MODIFY `income` DECIMAL(15, 2) NOT NULL,
    MODIFY `expense` DECIMAL(15, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `MonthHistory` ADD CONSTRAINT `MonthHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearHistory` ADD CONSTRAINT `YearHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
