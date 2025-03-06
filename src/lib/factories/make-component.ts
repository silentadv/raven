import {
  ComponentOptions,
  ComponentSchema,
  ComponentType,
} from "@/types/component";

export function makeComponent<
  T extends string,
  U extends ComponentType[],
  V extends ComponentSchema<T>
>(options: ComponentOptions<T, U, V>) {
  return options;
}
