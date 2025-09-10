/*
  Warnings:

  - You are about to drop the column `itinerary` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "itinerary";

-- CreateTable
CREATE TABLE "itinerary" (
    "bookingCode" TEXT NOT NULL,
    "couponNumber" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "cabin" TEXT NOT NULL,

    CONSTRAINT "itinerary_pkey" PRIMARY KEY ("bookingCode")
);

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_bookingCode_fkey" FOREIGN KEY ("bookingCode") REFERENCES "bookings"("bookingCode") ON DELETE RESTRICT ON UPDATE CASCADE;
