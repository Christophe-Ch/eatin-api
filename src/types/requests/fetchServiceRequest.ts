export default interface FetchServiceRequest {
  path: string;
  headers: any;
  body: any;
  method: string;
  token: string | undefined;
}
