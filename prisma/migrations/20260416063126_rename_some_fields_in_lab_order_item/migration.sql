/*
  Warnings:

  - You are about to drop the column `orderableCodeSnapshot` on the `LabOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderableNameSnapshot` on the `LabOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `priceSnapshot` on the `LabOrderItem` table. All the data in the column will be lost.
  - Added the required column `snapshotCode` to the `LabOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotName` to the `LabOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabOrderItem" DROP COLUMN "orderableCodeSnapshot",
DROP COLUMN "orderableNameSnapshot",
DROP COLUMN "priceSnapshot",
ADD COLUMN     "snapshotCode" TEXT NOT NULL,
ADD COLUMN     "snapshotName" TEXT NOT NULL,
ADD COLUMN     "snapshotPrice" DECIMAL(12,2);
