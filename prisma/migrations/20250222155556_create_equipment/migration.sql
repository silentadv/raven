/*
  Warnings:

  - The values [DAILY] on the enum `CooldownType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `cooldowns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cooldowns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `character_id` on the `items` table. All the data in the column will be lost.
  - The `id` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `characters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guilds` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,item_id]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EquipmentSlotType" AS ENUM ('Head', 'Body', 'LeftHand', 'RightHand', 'Foot');

-- AlterEnum
BEGIN;
CREATE TYPE "CooldownType_new" AS ENUM ('Daily');
ALTER TABLE "cooldowns" ALTER COLUMN "type" TYPE "CooldownType_new" USING ("type"::text::"CooldownType_new");
ALTER TYPE "CooldownType" RENAME TO "CooldownType_old";
ALTER TYPE "CooldownType_new" RENAME TO "CooldownType";
DROP TYPE "CooldownType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_user_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_character_id_fkey";

-- AlterTable
ALTER TABLE "cooldowns" DROP CONSTRAINT "cooldowns_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "cooldowns_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
DROP COLUMN "character_id",
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "agility" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "hp" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "magic" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "resistance" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp_cap" INTEGER NOT NULL DEFAULT 1000;

-- DropTable
DROP TABLE "characters";

-- DropTable
DROP TABLE "guilds";

-- CreateTable
CREATE TABLE "equipments" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "slot" "EquipmentSlotType" NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipments_user_id_slot_key" ON "equipments"("user_id", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "items_user_id_key" ON "items"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_user_id_item_id_key" ON "items"("user_id", "item_id");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
