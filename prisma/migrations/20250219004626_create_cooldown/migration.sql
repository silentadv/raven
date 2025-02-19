-- CreateEnum
CREATE TYPE "CooldownType" AS ENUM ('DAILY');

-- CreateTable
CREATE TABLE "cooldowns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "CooldownType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cooldowns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cooldowns" ADD CONSTRAINT "cooldowns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
