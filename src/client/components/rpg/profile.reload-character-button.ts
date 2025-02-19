import { ComponentType } from "@/@types/component";
import { GetProfileController } from "@/client/controllers/get-profile";
import { makeComponent } from "@/lib/factories/make-component";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { InteractionUpdateOptions } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "reload-character/:userId/:characterId",
  name: "reload-character",
  types: [ComponentType.Button],
  schema: z.object({
    userId: z.coerce.string(),
    characterId: z.coerce.string(),
  }),
  async execute({ interaction, args }) {
    const guildsRepository = new PrismaGuildsRepository();
    const profileController = new GetProfileController(guildsRepository);
    const response = await profileController.handle({
      userUsername: interaction.user.username,
      userDiscordId: interaction.user.id,
      userGuildDiscordId: interaction.guild.id,
      characterId: args.characterId,
    });

    interaction.update(response as InteractionUpdateOptions);
  },
});
