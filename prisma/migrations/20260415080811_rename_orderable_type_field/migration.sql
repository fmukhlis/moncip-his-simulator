/*
  Warnings:

  - You are about to drop the column `orderableType` on the `OrderableService` table. All the data in the column will be lost.
  - Added the required column `type` to the `OrderableService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderableService" DROP COLUMN "orderableType",
ADD COLUMN     "type" "OrderableType" NOT NULL;
