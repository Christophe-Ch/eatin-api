import FetchError from "./fetchError";
export default class ServiceError extends FetchError {
  constructor(code: number, message: string, details: any[]) {
    super(code, message, details);
  }
}
