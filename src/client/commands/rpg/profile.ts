import { GetProfileController } from "@/client/controllers/get-profile";
import { makeCommand } from "@/lib/factories/make-command";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { MessageReplyOptions } from "discord.js";

export default makeCommand({
  name: "profile",
  category: "rpg",
  aliases: ["perfil"],
  async handle({ message }) {
    const guildsRepository = new PrismaGuildsRepository();
    const profileController = new GetProfileController(guildsRepository);
    const response = await profileController.handle({
      userUsername: message.author.username,
      userDiscordId: message.author.id,
      userGuildDiscordId: message.guild.id,
    });

    message.reply(response as MessageReplyOptions);
  },
});
