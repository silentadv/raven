import { INDICATORS } from "@raven-ui/constants/emojis";

export interface ListField {
  name: string;
  value: string;
}

export function makeList(...raw: string[]) {
  return raw.slice(0, 8).map((raw, i) => `${INDICATORS[i]} ${raw}`);
}

export function makeFieldList(...raw: ListField[]) {
  return raw
    .slice(0, 8)
    .map(({ name, value }, i) => ({ name: `${INDICATORS[i]} ${name}`, value }));
}
