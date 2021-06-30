import BaseError from "./baseError";
export default class NotConnectedError extends BaseError {
  constructor() {
    super(401, "User not connected.", []);
  }
}
