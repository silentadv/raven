import { ComponentType } from "@/@types/component";
import { createUpCharacterModal } from "@/lib/components/up-character-modal";
import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { joinText } from "@/lib/utils/join-text";
import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { InvalidAttributePointsAllocation } from "@/use-cases/errors/InvalidAttributePointsAllocation";
import { makeAllocateCharacterAttributePointsUseCase } from "@/use-cases/factories/make-allocate-character-attribute-points-use-case";
import { MessageFlags } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "up-character/:userId/:characterId",
  name: "up-character",
  types: [ComponentType.Button, ComponentType.Modal],
  schema: z.object({
    userId: z.coerce.string(),
    characterId: z.coerce.string(),
  }),
  async execute({ interaction, args }) {
    if (interaction.isModalSubmit()) {
      const rawAllocatedStrengthPoints =
        interaction.fields.getTextInputValue("strength");
      const rawAllocatedMagicPoints =
        interaction.fields.getTextInputValue("magic");
      const rawAllocatedAgilityPoints =
        interaction.fields.getTextInputValue("agility");
      const rawAllocatedResistancePoints =
        interaction.fields.getTextInputValue("resistance");

      const fieldParser = (val: unknown) =>
        val === "" ? undefined : Number(val);

      const upCharacterSchema = z.object({
        strength: z.preprocess(fieldParser, z.number().min(1).optional()),
        agility: z.preprocess(fieldParser, z.number().min(1).optional()),
        magic: z.preprocess(fieldParser, z.number().min(1).optional()),
        resistance: z.preprocess(fieldParser, z.number().min(1).optional()),
      });

      try {
        const pointsDistribution = upCharacterSchema.parse({
          strength: rawAllocatedStrengthPoints ?? "",
          agility: rawAllocatedAgilityPoints ?? "",
          magic: rawAllocatedMagicPoints ?? "",
          resistance: rawAllocatedResistancePoints ?? "",
        });

        if (
          !pointsDistribution.agility &&
          !pointsDistribution.magic &&
          !pointsDistribution.strength &&
          !pointsDistribution.resistance
        )
          throw new Error();

        const allocateCharacterAttributePoints =
          makeAllocateCharacterAttributePointsUseCase();

        await allocateCharacterAttributePoints.handle({
          userCharacterId: args.characterId,
          userDiscordId: args.userId,
          ...pointsDistribution,
        });

        return await interaction.reply({
          content: joinText(
            `> ${icons.static.success} | ${interaction.user}, você **distribuiu** os pontos do **personagem** com **sucesso**.`,
            `> -# **Recarregue** o perfil para **visualizar** as **alterações**`
          ),
          flags: [MessageFlags.Ephemeral],
        });
      } catch (error) {
        if (error instanceof InvalidAttributePointsAllocation)
          return await interaction.reply({
            content: joinText(
              `> ${icons.static.danger} | ${interaction.user}, você **distribuiu** os pontos do **personagem** de forma **inválida**.`,
              `> -# Erro: Você não possui essa quantidade de pontos para distribuir.`
            ),
            flags: [MessageFlags.Ephemeral],
          });

        if (error instanceof Error)
          return await interaction.reply({
            content: joinText(
              `> ${icons.static.danger} | ${interaction.user}, você **distribuiu** os pontos do **personagem** de forma **inválida**.`,
              `> -# Erro: Você inseriu valores inválidos nos campos.`
            ),
            flags: [MessageFlags.Ephemeral],
          });
      }
    }

    if (interaction.isButton()) {
      const charactersRepository = new PrismaCharactersRepository();
      const character = (await charactersRepository.findById(
        args.characterId
      ))!;

      const modal = createUpCharacterModal(interaction.user.id, character);
      return interaction.showModal(modal);
    }
  },
});
