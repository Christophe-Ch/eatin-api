export default class BaseError extends Error {
  code: number;
  details: any[];

  constructor(code: number = 400, message: string = "", details: any[] = []) {
    super(message);

    this.code = code;
    this.details = details;
  }

  public static fromError(error: Error): BaseError {
    return new BaseError(400, error.message, []);
  }
}
