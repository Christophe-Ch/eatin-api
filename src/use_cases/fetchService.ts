import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";
import jwtService from "../utils/services/jwtService";
import NotAuthorizedError from "../types/errors/notAuthorizedError";
import axios, { AxiosRequestConfig, Method } from "axios";
import ServiceError from "../types/errors/serviceError";

export default async (request: FetchServiceRequest) => {
  // Check app token
  let result;
  try {
    result = await axios.get(
      `http://eatin-ms-application-service:3000/application?token=${request.appToken}`
    );
  } catch (error) {
    throw new ServiceError(400, "Application service not available.", []);
  }

  if (
    result.status != 200 ||
    !Array.isArray(result.data) ||
    result.data.length == 0
  ) {
    throw new NotAuthorizedError();
  }

  // Find service
  const service = request.path.split("/")[2].split("?")[0];
  const serviceRoutes = process.env[`SERVICE_CONFIG_${service.toUpperCase()}`];

  if (!serviceRoutes) {
    throw new ServiceNotFoundError();
  }

  // Find route
  const routes = <any[]>JSON.parse(serviceRoutes);
  const route = routes.find(
    (route) =>
      route.method == request.method &&
      new RegExp(`/api/${service}${route.path}/?`).test(request.path)
  );

  if (!route) {
    throw new ServiceNotFoundError();
  }

  // Check role if necessary
  if (
    route.roles &&
    (!request.userToken ||
      !jwtService.hasRoles(request.userToken.split("Bearer ")[1], route.roles))
  ) {
    throw new NotAuthorizedError();
  }

  // Send request
  let serviceResult;
  try {
    const requestParams: AxiosRequestConfig = {
      method: <Method>request.method,
      url: `http://eatin-ms-${service}-service:3000/${
        request.path.split("/api/")[1]
      }`,
    };

    if (["POST", "PUT"].indexOf(request.method) != -1) {
      requestParams.data = request.body;
    }

    serviceResult = await axios.request(requestParams);
  } catch (error) {
    throw new ServiceError(400, "Service error", error.response.data.errors);
  }

  return serviceResult.data;
};
