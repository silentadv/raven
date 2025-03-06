import type { Collection } from "discord.js";
import { CommandOptions } from "../command";
import { ComponentOptions } from "../component";
import { FishingSession } from "../fishing";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, CommandOptions>;
    components: Collection<string, ComponentOptions<any, any, any>>;
  }
}
