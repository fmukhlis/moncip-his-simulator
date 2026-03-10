/*
  Warnings:

  - You are about to drop the column `mrn` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mrnNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_mrn_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "mrn",
ADD COLUMN     "mrnNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mrnNumber_key" ON "Patient"("mrnNumber");
