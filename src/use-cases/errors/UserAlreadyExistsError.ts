export class UserAlreadyExistsError extends Error {
  public constructor() {
    super("Já existe um usuário cadastrado com esse id de usuário do discord.");
  }
}
