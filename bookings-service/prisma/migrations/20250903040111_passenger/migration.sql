/*
  Warnings:

  - You are about to drop the column `passengers` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "passengers";

-- CreateTable
CREATE TABLE "Passenger" (
    "id" INTEGER NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "memberNumber" INTEGER NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_bookingCode_fkey" FOREIGN KEY ("bookingCode") REFERENCES "bookings"("bookingCode") ON DELETE RESTRICT ON UPDATE CASCADE;
