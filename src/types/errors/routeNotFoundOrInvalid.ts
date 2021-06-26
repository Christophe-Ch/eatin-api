import BaseError from "./baseError";
export default class RouteNotFoundOrInvalid extends BaseError {
  constructor() {
    super(404, "Route not found or invalid.", []);
  }
}
