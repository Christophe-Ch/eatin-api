import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";
import jwtService from "../utils/services/jwtService";
import NotAuthorizedError from "../types/errors/notAuthorizedError";
import axios, { AxiosRequestConfig, Method } from "axios";
import ServiceError from "../types/errors/serviceError";

const checkAppToken = async (appToken: string) => {
  // Check app token
  let result;
  try {
    result = await axios.get(
      `http://eatin-ms-application-service:3000/application?token=${appToken}`
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
};

const findService = (request: FetchServiceRequest) => {
  const service = request.path.split("/")[2].split("?")[0];
  const serviceRoutes = process.env[`SERVICE_CONFIG_${service.toUpperCase()}`];

  if (!serviceRoutes) {
    throw new ServiceNotFoundError();
  }

  return { service, serviceRoutes };
};

const findRoute = (
  request: FetchServiceRequest,
  service: string,
  serviceRoutes: string
) => {
  const routes = <any[]>JSON.parse(serviceRoutes);
  const route = routes.find(
    (route) =>
      route.method == request.method &&
      new RegExp(`/api/${service}${route.path}/?`).test(request.path)
  );

  if (!route) {
    throw new ServiceNotFoundError();
  }

  return route;
};

const checkRoles = (request: FetchServiceRequest, route: any) => {
  if (
    !request.userToken ||
    !jwtService.hasRoles(request.userToken.split("Bearer ")[1], route.roles)
  ) {
    throw new NotAuthorizedError();
  }
};

const sendRequest = async (request: FetchServiceRequest, service: string) => {
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

export default async (request: FetchServiceRequest) => {
  try {
    await checkAppToken(request.appToken);

    const { service, serviceRoutes } = findService(request);
    const route = findRoute(request, service, serviceRoutes);
    if (route.roles) {
      checkRoles(request, route);
    }

    return sendRequest(request, service);
  } catch (error) {
    throw error;
  }
};
