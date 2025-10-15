-- CreateTable
CREATE TABLE "cities" (
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "queries" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("name","code")
);
