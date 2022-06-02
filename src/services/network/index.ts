// export const BASE_URL = "http://localhost:5000";
export const BASE_URL = "https://research-project-tool.herokuapp.com";
export const PINATA_URL = "https://gateway.pinata.cloud/ipfs/";

const axios = require("axios").default;

export function sendHttpRequest(
  method: string,
  url: string,
  params: any = null,
  data: any = null,
  contentType: any = "application/json",
  headers: any = null
) {
  url = params ? url + "?" + constructUrlWithParams(params) : url;

  const request = axios({
    method: method,
    headers: headers ? headers : { "Content-Type": contentType },
    url: url,
    data: data,
  });
  return request;
}

function constructUrlWithParams(params: any) {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
  return query;
}
