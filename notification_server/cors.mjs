// import http from "http";
// import url from "url";
// import httpStatus from "./httpStatus.mjs";
// // import logger from "./logger.js";

// async function CORS_preflignt(req, res) {
//     logger.log("info", "ins_utilisateur --OPTION");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Request-Method",
//       "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
//     );
//     res.statusCode = 200;
//     res.end();
//   }

//   async function setCORSHeaders(req, res) {
//     logger.log("info", "setCORSHeaders --OPTION");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//   }

//   export {
//     setCORSHeaders,
//     CORS_preflignt
//   }
