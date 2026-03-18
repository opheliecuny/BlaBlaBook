/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");
