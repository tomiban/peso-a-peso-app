/*
  Warnings:

  - You are about to alter the column `amount` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `income` on the `MonthHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `expense` on the `MonthHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `targetAmount` on the `SavingsGoal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `currentAmount` on the `SavingsGoal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `income` on the `YearHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.
  - You are about to alter the column `expense` on the `YearHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Budget` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `MonthHistory` MODIFY `income` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `expense` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `SavingsGoal` MODIFY `targetAmount` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `currentAmount` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `YearHistory` MODIFY `income` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `expense` DOUBLE NOT NULL DEFAULT 0.00;
