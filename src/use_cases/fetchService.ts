import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";
import jwtService from "../utils/services/jwtService";
import NotAuthorizedError from "../types/errors/notAuthorizedError";

export default async (request: FetchServiceRequest) => {
  // Find service
  const service = request.path.split("/")[2];
  const serviceRoutes = process.env[`SERVICE_CONFIG_${service.toUpperCase()}`];

  if (!serviceRoutes) {
    throw new ServiceNotFoundError();
  }

  // Find route
  const routes = <any[]>JSON.parse(serviceRoutes);
  const route = routes.find(route => (new RegExp(`/api/${service}${route.path}`)).test(request.path));

  if (!route) {
    throw new ServiceNotFoundError();
  }

  // Check role if necessary
  if (route.roles && (!request.userToken || !jwtService.hasRoles(request.userToken.split("Bearer ")[1], route.roles))) {
    throw new NotAuthorizedError();
  }

  // Check app token
  

  // Send request

  return request;
};
