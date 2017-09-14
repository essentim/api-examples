const config = require('./config');
const fetch = require('node-fetch');
const checkStatus = require('./lib/fetch').checkStatus;
const socketio = require('socket.io-client');
const _ = require('underscore');


const apiUrl = config.api.host+config.api.path;
const io = socketio(config.socket.host,{path: config.socket.path});
const deviceId = process.argv[2];

console.log("using api:",apiUrl);
console.log("using socket:",config.socket.host+config.socket.path);
deviceId && console.log("filtering on device:",deviceId);
console.log();

io.on("events",(eventJson) => {
  if (deviceId && deviceId != eventJson.device) {
    //ignore events for devices that do not match the filtered device
    return;
  }
  console.log("-> ", eventJson.device,eventJson.event,eventJson.data ? JSON.stringify(eventJson.data) : '');
});
