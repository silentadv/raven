import type { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  findByDiscordId(discordId: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  save(user: User): Promise<User>;
}
