-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'CANCELLED';
ALTER TYPE "Status" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "passenger" DROP CONSTRAINT "passenger_bookingCode_fkey";

-- AddForeignKey
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_bookingCode_fkey" FOREIGN KEY ("bookingCode") REFERENCES "bookings"("bookingCode") ON DELETE CASCADE ON UPDATE CASCADE;
