/*
  Warnings:

  - You are about to drop the column `cabin` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `transport` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `transportId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `itinerary` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "cabin",
DROP COLUMN "date",
DROP COLUMN "destination",
DROP COLUMN "origin",
DROP COLUMN "transport",
DROP COLUMN "transportId",
ADD COLUMN     "itinerary" JSONB NOT NULL;
