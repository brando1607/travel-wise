/*
  Warnings:

  - You are about to drop the `pendingNameChanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pendingNameChanges" DROP CONSTRAINT "pendingNameChanges_memberNumber_fkey";

-- DropTable
DROP TABLE "pendingNameChanges";

-- CreateTable
CREATE TABLE "pending_name_changes" (
    "id" SERIAL NOT NULL,
    "memberNumber" INTEGER NOT NULL,
    "originalName" TEXT,
    "newName" TEXT,
    "originalLastName" TEXT,
    "newLastName" TEXT,
    "status" "NameChangeStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "pending_name_changes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pending_name_changes" ADD CONSTRAINT "pending_name_changes_memberNumber_fkey" FOREIGN KEY ("memberNumber") REFERENCES "users"("memberNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
