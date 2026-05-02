/*
  Warnings:

  - You are about to drop the column `active` on the `OrderableService` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OrderableService_userId_active_idx";

-- AlterTable
ALTER TABLE "OrderableService" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "OrderableService_userId_isActive_idx" ON "OrderableService"("userId", "isActive");
