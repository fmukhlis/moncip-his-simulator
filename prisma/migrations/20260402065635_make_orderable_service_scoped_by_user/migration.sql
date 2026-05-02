/*
  Warnings:

  - A unique constraint covering the columns `[userId,orderNo]` on the table `LabOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,code]` on the table `OrderableService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `OrderableService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LabOrderItem" DROP CONSTRAINT "LabOrderItem_labOrderId_fkey";

-- DropIndex
DROP INDEX "LabOrder_orderNo_key";

-- DropIndex
DROP INDEX "OrderableService_code_key";

-- AlterTable
ALTER TABLE "LabOrder" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderableService" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "LabOrder_userId_patientId_idx" ON "LabOrder"("userId", "patientId");

-- CreateIndex
CREATE INDEX "LabOrder_userId_encounterId_idx" ON "LabOrder"("userId", "encounterId");

-- CreateIndex
CREATE INDEX "LabOrder_userId_status_idx" ON "LabOrder"("userId", "status");

-- CreateIndex
CREATE INDEX "LabOrder_orderedAt_idx" ON "LabOrder"("orderedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_userId_orderNo_key" ON "LabOrder"("userId", "orderNo");

-- CreateIndex
CREATE INDEX "LabOrderItem_labOrderId_idx" ON "LabOrderItem"("labOrderId");

-- CreateIndex
CREATE INDEX "LabOrderItem_orderableServiceId_idx" ON "LabOrderItem"("orderableServiceId");

-- CreateIndex
CREATE INDEX "OrderableService_userId_active_idx" ON "OrderableService"("userId", "active");

-- CreateIndex
CREATE INDEX "OrderableService_userId_category_idx" ON "OrderableService"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "OrderableService_userId_code_key" ON "OrderableService"("userId", "code");

-- AddForeignKey
ALTER TABLE "OrderableService" ADD CONSTRAINT "OrderableService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrderItem" ADD CONSTRAINT "LabOrderItem_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "LabOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
