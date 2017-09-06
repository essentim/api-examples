const config = require('./config');
const fetch = require('node-fetch');
const apiUrl = config.api.host+config.api.path;

console.log("using api:",apiUrl);

//fetch list of registered devices
fetch(apiUrl+"/devices")
  //get payload from response
  .then(response => response.json())
  //list all devices
  .then(result => {
    if (!Array.isArray(result)) {
      throw new Error("expected array of devices")
    }
    if (result.length == 0) {
      throw new Error("no devices found")
    }
    return result;
  })
  .then(result => {
    result.forEach(device => {
      console.log("====",device.name,"====");
      console.log(" id:",device.id);
      console.log(" type:",device.type);
      console.log(" sensors:");
      device.sensors
        .filter(sensor=> sensor.primary)
        .map(sensor => {
          console.log("  ",sensor.name,"in",sensor.unit,"(id:"+sensor.id+")");
      });
      console.log();
    });
  })
  .catch(err=>{
    console.log("Error:",err.message);
  });
