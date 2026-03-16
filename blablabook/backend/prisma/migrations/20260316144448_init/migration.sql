CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('TO_READ', 'READING', 'READ');

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "isbn" VARCHAR(20),
    "openLibraryId" VARCHAR(100),
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255),
    "genre" VARCHAR(100),
    "description" TEXT,
    "thumbnail" VARCHAR(512),
    "publisher" VARCHAR(512),
    "pageCount" INTEGER,
    "language" VARCHAR(10),
    "publishedYear" INTEGER,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_item" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'TO_READ',
    "rating" INTEGER,
    "review" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_openLibraryId_key" ON "book"("openLibraryId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_book" ON "library_item"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "library_item" ADD CONSTRAINT "fk_book" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_item" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
