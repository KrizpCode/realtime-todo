-- DropForeignKey
ALTER TABLE "TodoList" DROP CONSTRAINT "TodoList_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "TodoList" ADD CONSTRAINT "TodoList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
