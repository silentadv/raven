export class FishingSessionAlreadyExistsError extends Error {
  public constructor() {
    super("Este usuário já está em uma sessão de pesca.");
  }
}
