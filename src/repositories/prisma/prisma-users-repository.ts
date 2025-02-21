import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  public async save(user: User) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return updatedUser;
  }

  public async findByDiscordId(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        discord_id: id,
      },
    });

    return user;
  }

  public async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
