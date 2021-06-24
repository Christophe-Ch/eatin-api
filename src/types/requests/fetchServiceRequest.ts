export default interface FetchServiceRequest {
  path: string;
  headers: any;
  body: any;
  method: string;
  userToken: string | undefined;
  appToken: string;
}
