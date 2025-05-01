-- CreateEnum
CREATE TYPE "NameChangeStatus" AS ENUM ('DONE', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "pendingNameChanges" ADD COLUMN     "status" "NameChangeStatus" NOT NULL DEFAULT 'PENDING';
