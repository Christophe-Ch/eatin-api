import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";
import jwtService from "../utils/services/jwtService";
import NotAuthorizedError from "../types/errors/notAuthorizedError";

export default async (request: FetchServiceRequest) => {
  const service = request.path.split("/")[2];
  const serviceRoutes = process.env[`SERVICE_CONFIG_${service.toUpperCase()}`];
  if (!serviceRoutes) {
    throw new ServiceNotFoundError();
  }

  const routes = <any[]>JSON.parse(serviceRoutes);
  const route = routes.find(route => (new RegExp(route.path)).test(request.path));

  if(!route) {
    throw new ServiceNotFoundError();
  }

  if(route.roles && (!request.token || !jwtService.hasRoles(request.token, route.roles))) {
    throw new NotAuthorizedError();
  }

  // Check app token

  // Send request

  return request;
};
