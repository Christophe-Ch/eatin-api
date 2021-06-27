import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";
import jwtService from "../utils/services/jwtService";
import NotAuthorizedError from "../types/errors/notAuthorizedError";
import axios, { AxiosRequestConfig, Method } from "axios";
import ServiceError from "../types/errors/serviceError";
import BaseError from "../types/errors/baseError";
import RouteNotFoundOrInvalid from "../types/errors/routeNotFoundOrInvalid";

const checkAppToken = async (appToken: string) => {
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
      new RegExp(`/api/${service}${route.path}/?$`).test(
        request.path.split("?")[0]
      )
  );

  if (!route) {
    throw new RouteNotFoundOrInvalid();
  }

  return route;
};

const checkRoles = (route: any, payload: any) => {
  if (!payload.role || route.roles.indexOf(payload.role) == -1) {
    throw new NotAuthorizedError();
  }
};

const sendRequest = async (
  request: FetchServiceRequest,
  service: string,
  user: any
) => {
  let serviceResult;
  try {
    const requestParams: AxiosRequestConfig = {
      method: <Method>request.method,
      url: `http://eatin-ms-${service}-service:3000/${
        request.path.split("/api/")[1]
      }`,
    };

    if (user) {
      requestParams.headers = {
        user: JSON.stringify(user),
      };
    }

    if (["POST", "PUT"].indexOf(request.method) != -1) {
      requestParams.data = request.body;
    }

    serviceResult = await axios.request(requestParams);
  } catch (error) {
    throw new ServiceError(
      error.response.status,
      error.response.statusText,
      error.response.data
    );
  }

  return serviceResult.data;
};

export default async (request: FetchServiceRequest) => {
  try {
    await checkAppToken(request.appToken);

    const { service, serviceRoutes } = findService(request);
    const route = findRoute(request, service, serviceRoutes);

    let user;
    if (!route.anonymous) {
      if (request.userToken) {
        try {
          user = jwtService.verifyAndRead(request.userToken);
        } catch (err) {
          throw new NotAuthorizedError();
        }
      } else {
        throw new NotAuthorizedError();
      }

      if (route.roles) {
        checkRoles(route, user);
      }
    }

    return sendRequest(request, service, user);
  } catch (error) {
    throw BaseError.fromError(error);
  }
};
