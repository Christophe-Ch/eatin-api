import FetchError from "./fetchError";
export default class ServiceNotFoundError extends FetchError {
  constructor() {
    super(404, "Service not found.", []);
  }
}
