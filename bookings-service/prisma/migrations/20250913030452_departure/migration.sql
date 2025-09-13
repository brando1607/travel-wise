/*
  Warnings:

  - Added the required column `arrival` to the `itinerary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itinerary" ADD COLUMN     "arrival" TEXT NOT NULL,
ADD COLUMN     "departure" TEXT NOT NULL;
