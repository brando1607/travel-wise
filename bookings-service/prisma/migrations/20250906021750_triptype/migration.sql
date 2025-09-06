/*
  Warnings:

  - Added the required column `tripType` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('ONE_WAY', 'ROUND_TRIP');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "tripType" "TripType" NOT NULL;
