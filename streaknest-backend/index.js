"use strict";

const http = require("http");
const app = require("./app");
const server = require("./src/server");


const httpServer = http.createServer(app);


console.log(server.port, server.host, server.message);
httpServer.listen(server.port, server.host, server.message);


