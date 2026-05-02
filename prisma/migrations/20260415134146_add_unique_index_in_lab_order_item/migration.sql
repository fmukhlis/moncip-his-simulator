/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `LabOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[labOrderId,orderableServiceId]` on the table `LabOrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LabOrder_orderedAt_idx";

-- DropIndex
DROP INDEX "LabOrder_userId_encounterId_idx";

-- DropIndex
DROP INDEX "LabOrder_userId_patientId_idx";

-- DropIndex
DROP INDEX "LabOrder_userId_status_idx";

-- AlterTable
ALTER TABLE "LabOrder" DROP COLUMN "deletedAt",
ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "LabOrder_userId_idx" ON "LabOrder"("userId");

-- CreateIndex
CREATE INDEX "LabOrder_patientId_idx" ON "LabOrder"("patientId");

-- CreateIndex
CREATE INDEX "LabOrder_encounterId_idx" ON "LabOrder"("encounterId");

-- CreateIndex
CREATE INDEX "LabOrder_orderingProviderId_idx" ON "LabOrder"("orderingProviderId");

-- CreateIndex
CREATE INDEX "LabOrder_status_idx" ON "LabOrder"("status");

-- CreateIndex
CREATE INDEX "LabOrder_createdAt_idx" ON "LabOrder"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrderItem_labOrderId_orderableServiceId_key" ON "LabOrderItem"("labOrderId", "orderableServiceId");
