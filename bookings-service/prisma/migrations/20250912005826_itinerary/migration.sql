/*
  Warnings:

  - The primary key for the `itinerary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `duration` to the `itinerary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `itinerary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportId` to the `itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itinerary" DROP CONSTRAINT "itinerary_pkey",
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "transportId" INTEGER NOT NULL,
ADD CONSTRAINT "itinerary_pkey" PRIMARY KEY ("bookingCode", "origin", "destination", "couponNumber");
