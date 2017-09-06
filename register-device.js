const config = require('./config');
const fetch = require('node-fetch');
const apiUrl = config.api.host+config.api.path;
const checkStatus = require('./lib/fetch').checkStatus;
console.log("using api:",apiUrl);
console.log();

/** configure device properties here **/
deviceID = "MyDeviceID"; //unique id that represents the device. e.g. mac-address or serial number
                         // --> ONLY ALPHANUMERIC AND UNDERSCORE
deviceName = "My Custom Device";
sensorID = "temp"; //unique id for the sensor on this device
sensorName = "Temperature"; //name to display for the values
sensorDescription = "external"; //provide additional information for the sensor. e.g. position or index
sensorMeasurand = "temperature"; //specify the physical quantity of the delivered value
/** end device configuration **/

//build json from defined variables
const deviceSpec = {
  id: deviceID,
  name: deviceName,
  sensors: [
    {
      id: sensorID,
      name: sensorName,
      descriptor: sensorDescription || undefined,
      primary: true,
      measurand: sensorMeasurand,
    }
  ]
};

console.log("sending device specification:\n",JSON.stringify(deviceSpec,null,2));
//push device spec to api
fetch(apiUrl+"/devices/"+deviceID,{
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deviceSpec)
  })
  .then(checkStatus)
  .then(response => response.json())
  .then(deviceJson=>{
    console.log("device registered successfully with id",deviceJson.id);
    return deviceJson.id;
  })
  .then(deviceId => {
    setInterval(() => {
      pushData(deviceId);
    },2000)
  })
  .catch(err=>{
    console.log("Error:",err.message);
    process.exit(1);
  })
  .then(()=>{
    console.log("Press Ctrl-C to quit");
  });


function pushData(deviceId) {
  const value = (25 + ((Math.random() * 4)-2)).toPrecision(3);
  console.log("sending data for ",deviceId,"->",value);
  const payload = {
    datapoints: [{
      sensorId: "temp",
      timestamp: Date.now(),
      value: value
    }]
  };
  fetch(apiUrl+"/devices/"+deviceId+"/data",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(checkStatus)
    .catch(err=>{
      console.log("Error:",err.message);
      process.exit(1);
    })
}
