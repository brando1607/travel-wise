-- CreateTable
CREATE TABLE "pendingNameChanges" (
    "memberNumber" INTEGER NOT NULL,
    "original" TEXT NOT NULL,
    "new" TEXT NOT NULL,

    CONSTRAINT "pendingNameChanges_pkey" PRIMARY KEY ("memberNumber")
);

-- AddForeignKey
ALTER TABLE "pendingNameChanges" ADD CONSTRAINT "pendingNameChanges_memberNumber_fkey" FOREIGN KEY ("memberNumber") REFERENCES "users"("memberNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
