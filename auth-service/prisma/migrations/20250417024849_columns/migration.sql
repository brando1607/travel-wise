-- AlterTable
ALTER TABLE "passwords" ADD COLUMN     "timeStamp" INTEGER,
ALTER COLUMN "tempPassword" DROP NOT NULL;
