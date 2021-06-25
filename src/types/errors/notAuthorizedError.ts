import BaseError from "./baseError";
export default class NotAuthorizedError extends BaseError {
  constructor() {
    super(403, "Request forbidden.", []);
  }
}
