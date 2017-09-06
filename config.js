'use strict';
//const host = "http://scouter.essentim.com";
const host = "http://localhost:3001";

const config = {
  api: {
    host: host,
    path:"/api/v1",
    version: '^1.2.1',
  },
  socket: {
    host: host,
    path: "/api/v1/socket.io"
  }
};

module.exports = config;