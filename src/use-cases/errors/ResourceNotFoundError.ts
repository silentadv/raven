export class ResourceNotFoundError extends Error {
  public constructor(resource: string) {
    super(`Resource ${resource} not found.`);
  }
}
