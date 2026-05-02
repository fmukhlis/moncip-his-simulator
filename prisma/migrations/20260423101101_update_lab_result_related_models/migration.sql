/*
  Warnings:

  - You are about to drop the column `issuedAt` on the `LabResultReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportPdfUrl` on the `LabResultReport` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LabResultItem_labResultReportId_labOrderItemId_key";

-- AlterTable
ALTER TABLE "LabResultReport" DROP COLUMN "issuedAt",
DROP COLUMN "reportPdfUrl";
