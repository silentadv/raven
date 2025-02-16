import type { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  findByDiscordId(id: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}
