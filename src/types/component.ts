import {
  ButtonInteraction,
  Client,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { z, ZodObject, ZodTypeAny } from "zod";

export type ComponentArgs<T extends string> = T extends `${infer A}/${infer B}`
  ? [...ExtractArg<A>, ...ComponentArgs<B>]
  : T extends `${infer A}`
  ? ExtractArg<A>
  : [];

export type ExtractArg<T extends string> = T extends `:${infer A}` ? [A] : [];

export type MergeArgs<T, U> = T & U;

export enum ComponentType {
  StringSelectMenu,
  Button,
  Modal,
}

export interface ComponentInteractionType {
  [ComponentType.StringSelectMenu]: StringSelectMenuInteraction<"cached">;
  [ComponentType.Button]: ButtonInteraction<"cached">;
  [ComponentType.Modal]: ModalSubmitInteraction<"cached">;
}

export interface ComponentRunner<
  T extends string,
  U extends ComponentType[],
  V extends ComponentSchema<T>
> {
  interaction: ComponentInteractionType[U[number]];
  args: z.infer<V>;
  client: Client<true>;
}

export type ComponentSchema<T extends string> = ZodObject<
  Record<ComponentArgs<T>[number], ZodTypeAny>
>;

export interface ComponentOptions<
  T extends string,
  U extends ComponentType[],
  V extends ComponentSchema<T>
> {
  id: `${this["name"]}/${T}`;
  types: U;
  name: string;
  schema: V;
  execute(options: ComponentRunner<T, U, V>): unknown;
}
