import BaseError from "./baseError";
export default class ServiceNotFoundError extends BaseError {
  constructor() {
    super(404, "Service not found.", []);
  }
}
