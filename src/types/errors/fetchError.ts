export default abstract class FetchError extends Error {
  code: number = 400;
  details: any[];

  constructor(code: number, message: string, details: any[]) {
    super(message);

    this.code = code;
    this.details = details;
  }
}
