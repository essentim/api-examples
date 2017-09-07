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
console.log("device:",deviceId);
console.log();

if (!deviceId || deviceId === "undefined") {
  console.log("no device id specified!");
  process.exit(1);
}

var sensorMap = {}; //map sensorId to sensor configuration and meta-data
//fetch list of registered devices
fetch(apiUrl+"/devices/"+deviceId)
  //check response
  .then(response => {
    if (response.status >= 400) {
      throw Error("could not fetch device information for id "+deviceId+": "+response.status+": "+response.statusText);
    }
    return response;
  })
  .then(checkStatus)
  //get payload from response
  .then(response => response.json())
  //read sensor configuration for device
  .then(device => {
    device.sensors.forEach(sensor => {
      sensorMap[sensor.id] = {
        name: sensor.name,
        unit: sensor.unit
      }
    });
  })
  //read device status
  .then(()=>{
    return fetch(apiUrl+"/devices/"+deviceId+"/status")
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        console.log("==== device status ====");
        console.log(" online:",json.connection);
        console.log(" gateway:",json.gateway.name);
        console.log(" location:",json.location || "Unknown");
        console.log();
      })
  })
  //subscribe to pubsub interface
  .then(() => {
    io.on("/devices/"+deviceId+"/location",handleDeviceDataEvent)
  })
  .catch(err=>{
    console.log("Error:",err.message);
    process.exit(1)
  })
  .then(() => {
    console.log("press Ctrl-C to quit");
  });


//callback function to handle event emitted by the api
function handleDeviceDataEvent (locationEvent) {
  if (!locationEvent) {
    console.log("->  Unknown");
  } else {
    console.log("-> ", locationEvent.name, "(", locationEvent.id, ")", " since", new Date(locationEvent.since));
  }
}