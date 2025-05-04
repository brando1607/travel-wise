-- DropForeignKey
ALTER TABLE "pending_name_changes" DROP CONSTRAINT "pending_name_changes_memberNumber_fkey";

-- AddForeignKey
ALTER TABLE "pending_name_changes" ADD CONSTRAINT "pending_name_changes_memberNumber_fkey" FOREIGN KEY ("memberNumber") REFERENCES "users"("memberNumber") ON DELETE CASCADE ON UPDATE CASCADE;
