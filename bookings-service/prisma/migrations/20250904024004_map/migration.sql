/*
  Warnings:

  - You are about to drop the `Passenger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_bookingCode_fkey";

-- DropTable
DROP TABLE "Passenger";

-- CreateTable
CREATE TABLE "passenger" (
    "id" INTEGER NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "memberNumber" INTEGER,

    CONSTRAINT "passenger_pkey" PRIMARY KEY ("id","bookingCode")
);

-- AddForeignKey
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_bookingCode_fkey" FOREIGN KEY ("bookingCode") REFERENCES "bookings"("bookingCode") ON DELETE RESTRICT ON UPDATE CASCADE;
