export class CommandArgsParseError extends Error {
  public constructor(public message: string) {
    super(message);
  }
}
