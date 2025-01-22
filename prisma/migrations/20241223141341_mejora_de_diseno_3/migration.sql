/*
  Warnings:

  - The primary key for the `MonthHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `YearHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `MonthHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `YearHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MonthHistory` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Transaction` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `YearHistory` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
