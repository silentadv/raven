-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "agility" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "magic" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "resistance" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 1;
