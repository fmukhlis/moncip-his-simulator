/*
  Warnings:

  - Changed the type of `patientMrnNumberSnapshot` on the `LabOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LabOrder" DROP COLUMN "patientMrnNumberSnapshot",
ADD COLUMN     "patientMrnNumberSnapshot" INTEGER NOT NULL;
