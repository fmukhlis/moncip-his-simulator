/*
  Warnings:

  - You are about to drop the column `sequence` on the `LabOrder` table. All the data in the column will be lost.
  - The `priority` column on the `LabOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `patientFullNameSnapshot` to the `LabOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientMrnNumberSnapshot` to the `LabOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerNameSnapshot` to the `LabOrder` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `OrderableService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LabOrderPriority" AS ENUM ('ROUTINE', 'STAT');

-- CreateEnum
CREATE TYPE "LabOrderIntegrationStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED');

-- CreateEnum
CREATE TYPE "OrderableServiceType" AS ENUM ('PANEL', 'SINGLE');

-- AlterEnum
ALTER TYPE "LabOrderItemStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "LabOrder" DROP COLUMN "sequence",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "integrationStatus" "LabOrderIntegrationStatus" NOT NULL DEFAULT 'SENT',
ADD COLUMN     "lisAcknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "lisFillerOrderNumber" TEXT,
ADD COLUMN     "lisOrderId" TEXT,
ADD COLUMN     "patientFullNameSnapshot" TEXT NOT NULL,
ADD COLUMN     "patientMrnNumberSnapshot" TEXT NOT NULL,
ADD COLUMN     "providerNameSnapshot" TEXT NOT NULL,
ADD COLUMN     "sentToLisAt" TIMESTAMP(3),
ADD COLUMN     "sourceSystem" TEXT NOT NULL DEFAULT 'HIS_MINI',
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "unitNameSnapshot" TEXT,
DROP COLUMN "priority",
ADD COLUMN     "priority" "LabOrderPriority" NOT NULL DEFAULT 'ROUTINE';

-- AlterTable
ALTER TABLE "LabOrderItem" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "lisItemId" TEXT,
ADD COLUMN     "lisTestCode" TEXT,
ADD COLUMN     "resultReceivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderableService" DROP COLUMN "type",
ADD COLUMN     "type" "OrderableServiceType" NOT NULL;

-- DropEnum
DROP TYPE "OrderPriority";

-- DropEnum
DROP TYPE "OrderableType";

-- CreateTable
CREATE TABLE "OrderableServiceComponent" (
    "id" TEXT NOT NULL,
    "panelServiceId" TEXT NOT NULL,
    "componentServiceId" TEXT NOT NULL,

    CONSTRAINT "OrderableServiceComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderableServiceComponent_panelServiceId_idx" ON "OrderableServiceComponent"("panelServiceId");

-- CreateIndex
CREATE INDEX "OrderableServiceComponent_componentServiceId_idx" ON "OrderableServiceComponent"("componentServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderableServiceComponent_panelServiceId_componentServiceId_key" ON "OrderableServiceComponent"("panelServiceId", "componentServiceId");

-- CreateIndex
CREATE INDEX "LabOrder_orderedAt_idx" ON "LabOrder"("orderedAt");

-- CreateIndex
CREATE INDEX "LabOrder_integrationStatus_idx" ON "LabOrder"("integrationStatus");

-- CreateIndex
CREATE INDEX "LabOrderItem_status_idx" ON "LabOrderItem"("status");

-- AddForeignKey
ALTER TABLE "OrderableServiceComponent" ADD CONSTRAINT "OrderableServiceComponent_panelServiceId_fkey" FOREIGN KEY ("panelServiceId") REFERENCES "OrderableService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderableServiceComponent" ADD CONSTRAINT "OrderableServiceComponent_componentServiceId_fkey" FOREIGN KEY ("componentServiceId") REFERENCES "OrderableService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
