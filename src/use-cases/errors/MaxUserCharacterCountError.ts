export class MaxUserCharacterCountError extends Error {
  public constructor(scope: "guild" | "user") {
    super(`O limite de personagem foi atingido no escopo de ${scope}.`);
  }
}
