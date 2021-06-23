import FetchError from "./fetchError";
export default class NotAuthorizedError extends FetchError {
  constructor() {
    super(403, "Request forbidden.", []);
  }
}
