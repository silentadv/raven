import { Character } from "@prisma/client";

const BASE_HP = 94;
const STRENGTH_MULTIPLIER = 2;
const RESISTANCE_MULTIPLIER = 3;

export function calculateMaxHp(character: Character) {
  return Math.ceil(
    (BASE_HP +
      character.strength * STRENGTH_MULTIPLIER +
      character.resistance * RESISTANCE_MULTIPLIER) *
      (1 + character.level / 100)
  );
}
