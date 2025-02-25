-- DropForeignKey
ALTER TABLE "TodoItem" DROP CONSTRAINT "TodoItem_listId_fkey";

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
