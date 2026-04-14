/*
  Warnings:

  - You are about to drop the column `endDate` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `encounterDateTime` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Encounter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderPriority" AS ENUM ('ROUTINE', 'STAT');

-- CreateEnum
CREATE TYPE "LabOrderStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LabOrderItemStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "endDate",
DROP COLUMN "metadata",
DROP COLUMN "provider",
DROP COLUMN "startDate",
ADD COLUMN     "encounterDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "metadata";

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderableService" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "specimenType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderableService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "orderingProviderId" TEXT NOT NULL,
    "status" "LabOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "orderNo" TEXT NOT NULL,
    "priority" "OrderPriority" NOT NULL DEFAULT 'ROUTINE',
    "clinicalNote" TEXT,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabOrderItem" (
    "id" TEXT NOT NULL,
    "labOrderId" TEXT NOT NULL,
    "orderableServiceId" TEXT NOT NULL,
    "status" "LabOrderItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "priceSnapshot" DECIMAL(12,2),
    "orderableCodeSnapshot" TEXT NOT NULL,
    "orderableNameSnapshot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_code_key" ON "Provider"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_code_key" ON "Unit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OrderableService_code_key" ON "OrderableService"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_orderNo_key" ON "LabOrder"("orderNo");

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_orderingProviderId_fkey" FOREIGN KEY ("orderingProviderId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrderItem" ADD CONSTRAINT "LabOrderItem_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "LabOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrderItem" ADD CONSTRAINT "LabOrderItem_orderableServiceId_fkey" FOREIGN KEY ("orderableServiceId") REFERENCES "OrderableService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
