/*
  Warnings:

  - A unique constraint covering the columns `[encounterNo]` on the table `Encounter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `encounterNo` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `Encounter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "encounterNo" TEXT NOT NULL,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EncounterCounter" (
    "period" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncounterCounter_pkey" PRIMARY KEY ("period")
);

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_encounterNo_key" ON "Encounter"("encounterNo");
