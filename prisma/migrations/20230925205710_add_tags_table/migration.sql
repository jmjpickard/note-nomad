-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "noteId" TEXT NOT NULL,
    "todosId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_todosId_fkey" FOREIGN KEY ("todosId") REFERENCES "Todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
