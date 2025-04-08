-- CreateTable
CREATE TABLE "passwords" (
    "memberNumber" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "tempPassword" TEXT NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("memberNumber")
);
