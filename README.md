# Prerequisites
This examples are implemented in JavaScript. To run this project you will need __nodejs v6__ and __npm__ running on your machine.
Installers are available on https://nodejs.org/en/

# Installation
After cloning the repository, install npm dependencies:
```bash
cd <project-folder>
npm install
```

The API URI has to be configured to establish communication with the API. The default points to a local
essentim system, in assumption to be connected via wifi to the scouter.  
To change the configuration, please edit the configuration

*config.js*
```javascript
const host = "http://scouter.essentim.com";
const config = {
  api: {
    host: host,
    path: "/api/v1",
    version: "^1.2.1",
  },
  socket: {
    host: host,
    path: "/api/v1/socket.io"
  }
}
```

Now you can run the examples
```bash
npm run <example-name>
```

# Documentation
All API endpoints can be accessed via [swagger-io](http://scouter.essentim.com:3001/documentation)
```bash
open http://scouter.essentim.com:3001/documentation
```


# Examples

## List Devices
This code snippet will connect to the api and list all registered devices and available Sensors.  
```bash
npm run list
```

## Register Device and Push Data
This Example shows how to register a own device and push data to the api. The default configuration registers
a device with the id **MyDeviceID** and provides one temperature sensor.
```bash
npm run register
``` 
**INFO: The Webapplications needs to be reloaded to show new registered devices**

You can modify this script by editing this block
```javascript
/** configure device properties here **/
deviceID = "MyDeviceID"; //unique id that represents the device. e.g. mac-address or serial number
                         // --> ONLY ALPHANUMERIC AND UNDERSCORE
deviceName = "My Custom Device";
sensorID = "temp"; //unique id for the sensor on this device
sensorName = "Temperature"; //name to display for the values
sensorDescription = "external"; //provide additional information for the sensor. e.g. position or index
sensorMeasurand = "temperature"; //specify the physical quantity of the delivered value
/** end device configuration **/
```
After a successful registration  the script will push data every 2 seconds to the api. The values is
a random number between 23.0 and 27.0

To push data triggered by another event, you can just call the api like the function *pushData*.  
Make sure the device is registered before sending data! Otherwise the request will be rejected with an 404.
The data push endpoint expects an payload with following format.  
Multiple Datapoints can be sent as bulk request.
```javascript
{
    datapoints: [
      {
        sensorId: <sensor-id as string>,
        timestamp: <timestamp>,
        value: <value as string or number>
      },
      {
        sensorId: <second-sensor-id as string>,
        timestamp: <timestamp>,
        value: <value as string or number>
      }
    ]
  }
```

## Subscribe Device Data
This Example shows how to connect to the pub/sub api to retrieve sensordata for devices.

The code snippet will connect to the socket.io pub/sub system. Every new sensor value will emit an event and will be 
received from the local code.
```bash
npm run subscribe-data <device-id>
``` 
To forward the subscribed sensor data in your own application modify the method *handleDeviceDataEvent*.  
The passed argument will be an JSON-object of this type:
```javascript
{ 
  point: 
   { 
     deviceId: <device-id>,
     sensorId: <sensor-id>,
     timestamp: <timestamp in milliseconds>,
     value: <value>,
     timestampPrevious: <timestamp of the previous received datapoint in milliseconds>,
     latest: true|false,
     duplicate: true|false 
   } 
}
```
## Subscribe Device Location
Same example like data subscription, but listens to location events on the pub/sub system.  
the emitted event will contain location name, id and timestamp.
```bash
npm run subscribe-location <device-id>
``` 


