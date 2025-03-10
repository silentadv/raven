import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { joinText } from "@/lib/utils/join-text";
import { ComponentType } from "@/types/component";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeGetFishingUseCase } from "@/use-cases/factories/make-get-fishing-use-case";
import { MessageFlags } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "get-fish/:userId",
  name: "get-fish",
  types: [ComponentType.Button],
  schema: z.object({
    userId: z.string(),
  }),
  async execute({ interaction }) {
    try {
      const getFishingUseCase = makeGetFishingUseCase();
      const { fishing } = await getFishingUseCase.handle({
        userDiscordId: interaction.user.id,
      });

      console.log(fishing);

      return interaction.reply({
        content: "> Pinto.",
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError &&
        error.resource === "fishing"
      )
        return interaction.reply({
          content: joinText(
            `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você **não iniciou** uma **sessão de pesca**.`,
            `> -# Utilize **r.fish** para **começar** sua **sessão de pesca**.`
          ),
          flags: [MessageFlags.Ephemeral],
        });
    }
  },
});
