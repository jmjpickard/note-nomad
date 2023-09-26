/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagsToTodos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagsToTodos_AB_unique" ON "_TagsToTodos"("A", "B");

-- CreateIndex
CREATE INDEX "_TagsToTodos_B_index" ON "_TagsToTodos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_userId_date_key" ON "Notes"("userId", "date");

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "tags_notes_userId_date_fkey" FOREIGN KEY ("userId", "date") REFERENCES "Notes"("userId", "date") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToTodos" ADD CONSTRAINT "_TagsToTodos_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToTodos" ADD CONSTRAINT "_TagsToTodos_B_fkey" FOREIGN KEY ("B") REFERENCES "Todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
