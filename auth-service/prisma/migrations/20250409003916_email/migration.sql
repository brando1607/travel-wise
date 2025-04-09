/*
  Warnings:

  - You are about to drop the column `email` on the `passwords` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "passwords_email_key";

-- AlterTable
ALTER TABLE "passwords" DROP COLUMN "email";
