/*
  Warnings:

  - You are about to drop the column `new` on the `pendingNameChanges` table. All the data in the column will be lost.
  - You are about to drop the column `original` on the `pendingNameChanges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pendingNameChanges" DROP COLUMN "new",
DROP COLUMN "original",
ADD COLUMN     "newLastName" TEXT,
ADD COLUMN     "newName" TEXT,
ADD COLUMN     "originalLastName" TEXT,
ADD COLUMN     "originalName" TEXT;
