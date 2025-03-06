import { FishingShopController } from "@/controllers/economy/fishing-shop-controller";
import { MainShopController } from "@/controllers/economy/main-shop-controller";
import { makeComponent } from "@/lib/factories/make-component";
import { ComponentType } from "@/types/component";
import { MessageFlags } from "discord.js";
import { z } from "zod";

type ShopType = "fishing" | "main";

export default makeComponent({
  id: "shop-menu/:userId",
  name: "shop-menu",
  schema: z.object({
    userId: z.string(),
  }),
  types: [ComponentType.StringSelectMenu],
  async execute({ interaction, args }) {
    const type = interaction.values[0] as ShopType;

    switch (type) {
      case "main":
        const mainShopController = new MainShopController();
        const mainResponse = await mainShopController.handle({
          userDiscordId: args.userId,
        });

        return interaction.update(mainResponse);
      case "fishing":
        const fishingShopController = new FishingShopController();
        const fishingResponse = await fishingShopController.handle({
          userDiscordId: args.userId,
        });

        return interaction.reply(fishingResponse);
    }
  },
});
