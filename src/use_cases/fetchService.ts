import FetchServiceRequest from "../types/requests/fetchServiceRequest";
import ServiceNotFoundError from "../types/errors/serviceNotFoundError";

export default async (request: FetchServiceRequest) => {
  const service = request.path.split("/")[2];

  if (!service) {
    throw new ServiceNotFoundError();
  }

  let serviceRoles = process.env[`SERVICE_CONFIG_${service.toUpperCase()}`];

  if (!serviceRoles) {
    throw new ServiceNotFoundError();
  }

  serviceRoles = JSON.parse(serviceRoles);

  return request;
};
