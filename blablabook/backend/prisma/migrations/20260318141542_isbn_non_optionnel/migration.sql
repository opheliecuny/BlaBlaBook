/*
  Warnings:

  - Made the column `isbn` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "book" ALTER COLUMN "isbn" SET NOT NULL;
