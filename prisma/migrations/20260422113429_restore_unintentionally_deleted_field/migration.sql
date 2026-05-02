/*
  Warnings:

  - Added the required column `sequence` to the `LabOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabOrder" ADD COLUMN     "sequence" INTEGER NOT NULL;
