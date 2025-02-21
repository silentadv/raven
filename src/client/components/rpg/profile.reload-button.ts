import { ComponentType } from "@/@types/component";
import { GetProfileController } from "@/client/controllers/get-profile";
import { makeComponent } from "@/lib/factories/make-component";
import { InteractionUpdateOptions } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "reload-profile/:userId",
  name: "reload-profile",
  types: [ComponentType.Button],
  schema: z.object({
    userId: z.coerce.string(),
  }),
  async execute({ interaction, args }) {
    const profileController = new GetProfileController();
    const response = await profileController.handle({
      userUsername: interaction.user.username,
      userDiscordId: interaction.user.id,
    });

    interaction.update(response as InteractionUpdateOptions);
  },
});
