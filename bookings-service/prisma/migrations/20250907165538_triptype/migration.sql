/*
  Warnings:

  - You are about to drop the column `tripType` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "tripType";

-- DropEnum
DROP TYPE "TripType";
