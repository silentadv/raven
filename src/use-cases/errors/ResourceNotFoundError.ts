export class ResourceNotFoundError extends Error {
  public constructor(public resource: string) {
    super(`O recurso "${resource}" não foi encontrado.`);
  }
}
