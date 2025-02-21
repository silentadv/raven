import { GetProfileController } from "@/client/controllers/get-profile";
import { makeCommand } from "@/lib/factories/make-command";
import { MessageReplyOptions } from "discord.js";

export default makeCommand({
  name: "profile",
  category: "rpg",
  aliases: ["perfil"],
  async handle({ message }) {
    const profileController = new GetProfileController();
    const response = await profileController.handle({
      userUsername: message.author.username,
      userDiscordId: message.author.id,
    });

    message.reply(response as MessageReplyOptions);
  },
});
