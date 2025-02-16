import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  public async findByDiscordId(id: string) {
    const user = this.items.find((item) => item.discord_id == id);
    return user || null;
  }

  public async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      discord_id: data.discord_id,
      created_at: new Date(),
    } satisfies User;

    this.items.push(user);

    return user;
  }
}
