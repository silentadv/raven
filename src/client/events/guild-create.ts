import { makeCreateGuildUseCase } from "@/use-cases/factories/make-create-guild-use-case";
import { makeEvent } from "@/lib/factories/make-event";

export default makeEvent({
  name: "guildCreate",
  handle(_, guild) {
    const createGuildUseCase = makeCreateGuildUseCase();
    createGuildUseCase
      .handle({
        guildDiscordId: guild.id,
        guildName: guild.name,
      })
      .then(() => console.log(`🔥 Guild Created: ${guild.id} - ${guild.name}.`))
      .catch(() => {});
  },
});
