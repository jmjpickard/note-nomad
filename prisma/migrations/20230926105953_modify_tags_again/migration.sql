-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "tags_todos_userId_date_fkey";

-- DropIndex
DROP INDEX "Todos_userId_date_key";

-- CreateTable
CREATE TABLE "_TagsToTodos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagsToTodos_AB_unique" ON "_TagsToTodos"("A", "B");

-- CreateIndex
CREATE INDEX "_TagsToTodos_B_index" ON "_TagsToTodos"("B");

-- AddForeignKey
ALTER TABLE "_TagsToTodos" ADD CONSTRAINT "_TagsToTodos_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToTodos" ADD CONSTRAINT "_TagsToTodos_B_fkey" FOREIGN KEY ("B") REFERENCES "Todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
