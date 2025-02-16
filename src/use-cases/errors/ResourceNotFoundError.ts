export class ResourceNotFoundError extends Error {
  public constructor(resource: string) {
    super(`O recurso "${resource}" não foi encontrado.`);
  }
}
