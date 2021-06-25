import BaseError from "./baseError";
export default class ServiceError extends BaseError {
  constructor(code: number, message: string, details: any[]) {
    super(code, message, details);
  }
}
