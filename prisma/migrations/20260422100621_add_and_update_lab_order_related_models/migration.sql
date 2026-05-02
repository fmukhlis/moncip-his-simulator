/*
  Warnings:

  - Added the required column `snapshotCategory` to the `LabOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderableServiceComponent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LabResultReportStatus" AS ENUM ('PRELIMINARY', 'FINAL', 'CORRECTED');

-- CreateEnum
CREATE TYPE "LabResultValueType" AS ENUM ('NUMERIC', 'TEXT', 'QUALITATIVE');

-- CreateEnum
CREATE TYPE "LabResultAbnormalFlag" AS ENUM ('LOW', 'HIGH', 'ABNORMAL', 'CRITICAL');

-- AlterTable
ALTER TABLE "LabOrder" ADD COLUMN     "lastIntegrationError" TEXT,
ADD COLUMN     "lastSentAttemptAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "LabOrderItem" ADD COLUMN     "snapshotCategory" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderableServiceComponent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "LabResultReport" (
    "id" TEXT NOT NULL,
    "labOrderId" TEXT NOT NULL,
    "status" "LabResultReportStatus" NOT NULL,
    "lisReportId" TEXT,
    "reportText" TEXT,
    "reportNumber" TEXT,
    "reportPdfUrl" TEXT,
    "performingLabNameSnapshot" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "LabResultReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResultItem" (
    "id" TEXT NOT NULL,
    "labOrderItemId" TEXT NOT NULL,
    "labResultReportId" TEXT NOT NULL,
    "valueType" "LabResultValueType" NOT NULL,
    "valueText" TEXT,
    "abnormalFlag" "LabResultAbnormalFlag",
    "valueNumeric" DECIMAL(18,4),
    "unitSnapshot" TEXT,
    "resultStatus" "LabResultReportStatus" NOT NULL,
    "lisResultItemId" TEXT,
    "testCodeSnapshot" TEXT NOT NULL,
    "testNameSnapshot" TEXT NOT NULL,
    "referenceRangeSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "observedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "LabResultItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabResultReport_reportNumber_key" ON "LabResultReport"("reportNumber");

-- CreateIndex
CREATE INDEX "LabResultReport_status_idx" ON "LabResultReport"("status");

-- CreateIndex
CREATE INDEX "LabResultReport_labOrderId_idx" ON "LabResultReport"("labOrderId");

-- CreateIndex
CREATE INDEX "LabResultReport_releasedAt_idx" ON "LabResultReport"("releasedAt");

-- CreateIndex
CREATE INDEX "LabResultItem_resultStatus_idx" ON "LabResultItem"("resultStatus");

-- CreateIndex
CREATE INDEX "LabResultItem_labOrderItemId_idx" ON "LabResultItem"("labOrderItemId");

-- CreateIndex
CREATE INDEX "LabResultItem_labResultReportId_idx" ON "LabResultItem"("labResultReportId");

-- CreateIndex
CREATE UNIQUE INDEX "LabResultItem_labResultReportId_labOrderItemId_key" ON "LabResultItem"("labResultReportId", "labOrderItemId");

-- AddForeignKey
ALTER TABLE "LabResultReport" ADD CONSTRAINT "LabResultReport_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "LabOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResultItem" ADD CONSTRAINT "LabResultItem_labOrderItemId_fkey" FOREIGN KEY ("labOrderItemId") REFERENCES "LabOrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResultItem" ADD CONSTRAINT "LabResultItem_labResultReportId_fkey" FOREIGN KEY ("labResultReportId") REFERENCES "LabResultReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
