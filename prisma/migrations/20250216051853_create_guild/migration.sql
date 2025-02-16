/*
  Warnings:

  - You are about to drop the column `server_id` on the `characters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,guild_id]` on the table `characters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guild_id` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "characters_user_id_server_id_key";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "server_id",
ADD COLUMN     "guild_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guilds_discord_id_key" ON "guilds"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "characters_user_id_guild_id_key" ON "characters"("user_id", "guild_id");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
