/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `passwords` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `passwords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passwords" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "passwords_email_key" ON "passwords"("email");
