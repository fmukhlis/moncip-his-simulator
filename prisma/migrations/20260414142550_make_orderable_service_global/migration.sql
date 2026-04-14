/*
  Warnings:

  - You are about to drop the column `isActive` on the `OrderableService` table. All the data in the column will be lost.
  - You are about to drop the column `specimenType` on the `OrderableService` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OrderableService` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `OrderableService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderableType` to the `OrderableService` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderableType" AS ENUM ('SINGLE', 'PANEL');

-- DropForeignKey
ALTER TABLE "OrderableService" DROP CONSTRAINT "OrderableService_userId_fkey";

-- DropIndex
DROP INDEX "OrderableService_userId_category_idx";

-- DropIndex
DROP INDEX "OrderableService_userId_code_key";

-- DropIndex
DROP INDEX "OrderableService_userId_isActive_idx";

-- AlterTable
ALTER TABLE "OrderableService" DROP COLUMN "isActive",
DROP COLUMN "specimenType",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "orderableType" "OrderableType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderableService_code_key" ON "OrderableService"("code");
