/*
  Warnings:

  - A unique constraint covering the columns `[type,user_id]` on the table `cooldowns` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cooldowns_type_user_id_key" ON "cooldowns"("type", "user_id");
