import { FishingBoardController } from "@/controllers/fishing/fishing-board-controller";
import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { joinText } from "@/lib/utils/join-text";
import { ComponentType } from "@/types/component";
import { FishingSessionAlreadyExistsError } from "@/use-cases/errors/FishingSessionAlreadyExistsError";
import { makeStartFishingUseCase } from "@/use-cases/factories/make-start-fishing-use-case";
import { InteractionUpdateOptions, MessageFlags } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "start-fishing/:userId",
  name: "start-fishing",
  types: [ComponentType.StringSelectMenu],
  schema: z.object({
    userId: z.string(),
  }),
  async execute({ interaction }) {
    const selectedBait = interaction.values.find((tool) =>
      tool.endsWith("_bait")
    );
    const selectedRod = interaction.values.find((tool) =>
      tool.endsWith("_rod")
    );

    if (!selectedBait || !selectedRod)
      return interaction.reply({
        content: joinText(
          `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você **não selecionou** os **itens necessários** para **iniciar** uma **sessão de pesca**`,
          `> -# Você precisa de uma **isca** e uma **vara de pesca** para pescar.`
        ),
        flags: [MessageFlags.Ephemeral],
      });

    try {
      const startFishingUseCase = makeStartFishingUseCase();
      const { fishing } = await startFishingUseCase.handle({
        userDiscordId: interaction.user.id,
        rod: selectedRod,
        bait: selectedBait,
      });

      const fishingBoardController = new FishingBoardController();
      const fishingBoardResponse = await fishingBoardController.handle({
        user: interaction.user,
        session: fishing,
      });

      return interaction.update(
        fishingBoardResponse as InteractionUpdateOptions
      );
    } catch (error) {
      if (error instanceof FishingSessionAlreadyExistsError)
        return interaction.update({
          content: `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você ja **está** em uma **sessão de pesca**.`,
          components: [],
        });
    }
  },
});
