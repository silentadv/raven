import { ComponentType } from "@/@types/component";
import { createEditCharacterModal } from "@/lib/components/edit-character-modal";
import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { joinText } from "@/lib/utils/join-text";
import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { makeEditCharactetUseCase } from "@/use-cases/factories/make-edit-character-use-case";
import { MessageFlags } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "edit-character/:userId/:characterId",
  name: "edit-character",
  types: [ComponentType.Button, ComponentType.Modal],
  schema: z.object({
    userId: z.coerce.string(),
    characterId: z.coerce.string(),
  }),
  async execute({ interaction, args }) {
    if (interaction.isModalSubmit()) {
      const updatedCharacterName = interaction.fields.getTextInputValue("name");

      const editCharacterUseCase = makeEditCharactetUseCase();
      await editCharacterUseCase.handle({
        characterId: args.characterId,
        character: {
          name: updatedCharacterName.slice(0, 25),
        },
      });

      return await interaction.reply({
        content: joinText(
          `> ${icons.static.success} | ${interaction.user}, o **nome** do seu **personagem** foi alterado com **sucesso** para \`${updatedCharacterName}\`.`,
          `> -# **Recarregue** o perfil para **visualizar** as **alterações**`
        ),
        flags: [MessageFlags.Ephemeral],
      });
    }

    if (interaction.isButton()) {
      const charactersRepository = new PrismaCharactersRepository();
      const character = (await charactersRepository.findById(
        args.characterId
      ))!;

      const modal = createEditCharacterModal(interaction.user.id, character);
      return interaction.showModal(modal);
    }
  },
});
