/*
  Warnings:

  - You are about to drop the column `department` on the `Encounter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "department",
ALTER COLUMN "encounterDateTime" SET DEFAULT CURRENT_TIMESTAMP;
