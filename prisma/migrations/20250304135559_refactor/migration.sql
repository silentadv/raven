/*
  Warnings:

  - Added the required column `type` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Currency', 'Tool', 'Drop');

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "type" "ItemType" NOT NULL;
