/*
  Warnings:

  - The primary key for the `MonthHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MonthHistory` table. All the data in the column will be lost.
  - The primary key for the `YearHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `YearHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `MonthHistory` DROP FOREIGN KEY `MonthHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `YearHistory` DROP FOREIGN KEY `YearHistory_userId_fkey`;

-- DropIndex
DROP INDEX `MonthHistory_userId_year_month_day_idx` ON `MonthHistory`;

-- DropIndex
DROP INDEX `YearHistory_userId_year_month_idx` ON `YearHistory`;

-- AlterTable
ALTER TABLE `MonthHistory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `year`, `month`, `day`);

-- AlterTable
ALTER TABLE `YearHistory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `year`, `month`);
