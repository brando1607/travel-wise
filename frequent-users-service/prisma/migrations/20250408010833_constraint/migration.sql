/*
  Warnings:

  - A unique constraint covering the columns `[memberNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `memberNumber` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "memberNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_memberNumber_key" ON "user"("memberNumber");
