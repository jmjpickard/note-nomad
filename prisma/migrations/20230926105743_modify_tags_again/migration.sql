/*
  Warnings:

  - You are about to drop the column `noteId` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `todosId` on the `Tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,date]` on the table `Todos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_noteId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_todosId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "noteId",
DROP COLUMN "todosId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notes_userId_date_key" ON "Notes"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Todos_userId_date_key" ON "Todos"("userId", "date");

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "tags_notes_userId_date_fkey" FOREIGN KEY ("userId", "date") REFERENCES "Notes"("userId", "date") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "tags_todos_userId_date_fkey" FOREIGN KEY ("userId", "date") REFERENCES "Todos"("userId", "date") ON DELETE CASCADE ON UPDATE CASCADE;
