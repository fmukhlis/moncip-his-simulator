/*
  Warnings:

  - You are about to drop the column `encounterDateTime` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `encounterNo` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `encounterType` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `labOrderNo` on the `LabOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId,no]` on the table `Encounter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,no]` on the table `LabOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `no` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no` to the `LabOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Encounter_patientId_encounterNo_key";

-- DropIndex
DROP INDEX "LabOrder_userId_labOrderNo_key";

-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "encounterDateTime",
DROP COLUMN "encounterNo",
DROP COLUMN "encounterType",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "no" TEXT NOT NULL,
ADD COLUMN     "type" "EncounterType" NOT NULL;

-- AlterTable
ALTER TABLE "LabOrder" DROP COLUMN "labOrderNo",
ADD COLUMN     "no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_patientId_no_key" ON "Encounter"("patientId", "no");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_userId_no_key" ON "LabOrder"("userId", "no");
