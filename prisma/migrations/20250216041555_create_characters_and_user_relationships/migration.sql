/*
  Warnings:

  - You are about to drop the column `character_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `experience_cap` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gold` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "character_name",
DROP COLUMN "experience",
DROP COLUMN "experience_cap",
DROP COLUMN "gold",
DROP COLUMN "level";

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "xp_cap" INTEGER NOT NULL DEFAULT 1000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_user_id_server_id_key" ON "characters"("user_id", "server_id");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
