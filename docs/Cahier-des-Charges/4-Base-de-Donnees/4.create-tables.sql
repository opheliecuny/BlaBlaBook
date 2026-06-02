BEGIN;

-- 0. Suppression des tables et du type ENUM s'ils existent déjà (pour éviter les erreurs de duplication)
DROP TABLE IF EXISTS "library_item" CASCADE;
DROP TABLE IF EXISTS "book" CASCADE;
DROP TABLE IF EXISTS "refresh_token" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS "ReadingStatus" CASCADE;

CREATE TYPE "ReadingStatus" AS ENUM ('TO_READ', 'READING', 'READ');

CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "refresh_token" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),

    -- Contrainte de clé étrangère
    CONSTRAINT fk_user_refresh_token FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "book" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "isbn" VARCHAR(20),
    "open_library_id" VARCHAR(100) UNIQUE,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255),
    "genre" VARCHAR(100),
    "description" TEXT,
    "thumbnail" VARCHAR(512),
    "publisher" VARCHAR(512),
    "page_count" INTEGER,
    "language" VARCHAR(10),
    "publication_date" INTEGER,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "library_item" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'TO_READ',
    "rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5),
    "review" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),

    -- Contraintes de clés étrangères
    CONSTRAINT fk_user FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT fk_book FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE,

    -- Empêche un utilisateur d'ajouter deux fois le même livre
    CONSTRAINT unique_user_book UNIQUE ("user_id", "book_id")
);

COMMIT;