/*
  Warnings:

  - The primary key for the `Passenger` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_pkey",
ADD CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id", "bookingCode");
