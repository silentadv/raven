export class GuildAlreadyExistsError extends Error {
  public constructor() {
    super(
      "Já existe uma guilda cadastrada com esse id de servidor do discord."
    );
  }
}
