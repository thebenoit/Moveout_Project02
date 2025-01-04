import http from "http";
import url from "url";
import httpStatus from "./http_status.js";
import logger from "./logger.js";
import { setCORSHeaders, CORS_preflignt } from "./cors.js";

async function envoyer_reponse(req, res, reponse, httpStatusCode) {
  res.statusCode = httpStatusCode;
  logger.log("info", "DEBUT >>> envoyer_reponse");
  logger.log("info", `HTTP Status Code: ${httpStatusCode}`);
  res.statusCode = httpStatusCode;
  setCORSHeaders(req, res);
  res.setHeader("Content-Type", "text/plain");  
  res.end(reponse);
}

export { envoyer_reponse };
