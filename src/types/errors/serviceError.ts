import BaseError from "./baseError";
export default class ServiceError extends BaseError {
  constructor(message: string, code: number, details: any[]) {
    super(code, message, details);
  }
}
