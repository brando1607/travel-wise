-- CreateEnum
CREATE TYPE "Transport" AS ENUM ('CAR', 'PLANE', 'TRAIN', 'BUS');

-- CreateEnum
CREATE TYPE "TransportId" AS ENUM ('FLIGHTNUMBER', 'PLATENUMBER', 'BUSNUMBER', 'TRAINNUMBER');

-- CreateEnum
CREATE TYPE "Cabin" AS ENUM ('ECONOMY', 'PREMIUM', 'BUSINESS');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "passengers" JSONB[],
    "email" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "transport" "Transport" NOT NULL,
    "transportId" "TransportId" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cabin" "Cabin" NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
