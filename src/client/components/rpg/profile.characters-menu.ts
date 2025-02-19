import { ComponentType } from "@/@types/component";
import { GetProfileController } from "@/client/controllers/get-profile";
import { makeComponent } from "@/lib/factories/make-component";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { InteractionUpdateOptions } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "characters-menu/:userId",
  name: "characters-menu",
  types: [ComponentType.StringSelectMenu],
  schema: z.object({
    userId: z.coerce.string(),
  }),
  async execute({ interaction }) {
    const guildsRepository = new PrismaGuildsRepository();
    const profileController = new GetProfileController(guildsRepository);
    const response = await profileController.handle({
      userUsername: interaction.user.username,
      userDiscordId: interaction.user.id,
      userGuildDiscordId: interaction.guild.id,
      characterId: interaction.values[0],
    });

    interaction.update(response as InteractionUpdateOptions);
  },
});
