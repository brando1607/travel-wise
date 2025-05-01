/*
  Warnings:

  - The primary key for the `pendingNameChanges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `pendingNameChanges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pendingNameChanges" DROP CONSTRAINT "pendingNameChanges_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "pendingNameChanges_pkey" PRIMARY KEY ("id");
