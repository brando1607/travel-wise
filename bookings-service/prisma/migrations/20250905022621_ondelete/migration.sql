-- DropForeignKey
ALTER TABLE "passenger" DROP CONSTRAINT "passenger_bookingCode_fkey";

-- AddForeignKey
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_bookingCode_fkey" FOREIGN KEY ("bookingCode") REFERENCES "bookings"("bookingCode") ON DELETE RESTRICT ON UPDATE CASCADE;
