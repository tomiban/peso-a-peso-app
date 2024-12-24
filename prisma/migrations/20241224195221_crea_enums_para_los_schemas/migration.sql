/*
  Warnings:

  - The values [CASH,BANK_ACCOUNT,CREDIT_CARD,SAVINGS,INVESTMENT] on the enum `Account_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isExpense` on the `Category` table. All the data in the column will be lost.
  - You are about to alter the column `frequency` on the `PaymentReminder` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(4))`.
  - You are about to alter the column `status` on the `PaymentReminder` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(5))`.
  - You are about to drop the column `isRecurring` on the `Transaction` table. All the data in the column will be lost.
  - The values [NONE,DAILY,WEEKLY,MONTHLY,YEARLY] on the enum `PaymentReminder_frequency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[name,userId,type]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Category_name_userId_isExpense_key` ON `Category`;

-- AlterTable
ALTER TABLE `Account` MODIFY `type` ENUM('EFECTIVO', 'CUENTA_BANCO', 'TARJETA_CREDITO', 'AHORROS', 'INVERSION') NOT NULL;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `isExpense`,
    ADD COLUMN `type` ENUM('GASTO', 'INGRESO') NULL;

-- AlterTable
ALTER TABLE `PaymentReminder` MODIFY `frequency` ENUM('NINGUNA', 'DIARIA', 'SEMANAL', 'MENSUAL', 'ANUAL') NOT NULL DEFAULT 'NINGUNA',
    MODIFY `status` ENUM('PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `isRecurring`,
    ALTER COLUMN `updatedAt` DROP DEFAULT,
    MODIFY `frequency` ENUM('NINGUNA', 'DIARIA', 'SEMANAL', 'MENSUAL', 'ANUAL') NULL,
    MODIFY `status` ENUM('COMPLETADA', 'PENDIENTE', 'CANCELADA') NOT NULL DEFAULT 'COMPLETADA';

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_userId_type_key` ON `Category`(`name`, `userId`, `type`);
