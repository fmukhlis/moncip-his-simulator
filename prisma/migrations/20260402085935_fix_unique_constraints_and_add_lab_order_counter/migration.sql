/*
  Warnings:

  - You are about to drop the column `orderNo` on the `LabOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId,encounterNo]` on the table `Encounter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,labOrderNo]` on the table `LabOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mrnNumber,userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nationalId,userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `labOrderNo` to the `LabOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `LabOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `LabOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Encounter_encounterNo_key";

-- DropIndex
DROP INDEX "LabOrder_userId_orderNo_key";

-- DropIndex
DROP INDEX "Patient_mrnNumber_key";

-- DropIndex
DROP INDEX "Patient_nationalId_key";

-- AlterTable
ALTER TABLE "LabOrder" DROP COLUMN "orderNo",
ADD COLUMN     "labOrderNo" TEXT NOT NULL,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "mrnNumber" DROP DEFAULT;
DROP SEQUENCE "Patient_mrnNumber_seq";

-- CreateTable
CREATE TABLE "LabOrderCounter" (
    "period" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrderCounter_pkey" PRIMARY KEY ("period")
);

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_patientId_encounterNo_key" ON "Encounter"("patientId", "encounterNo");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_userId_labOrderNo_key" ON "LabOrder"("userId", "labOrderNo");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mrnNumber_userId_key" ON "Patient"("mrnNumber", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_nationalId_userId_key" ON "Patient"("nationalId", "userId");
