/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

var serialport = require("serialport"), // include the serialport library
  SerialPort  = serialport.SerialPort,  // make a local instance of it
  portName = process.argv[2],       // get the serial port name from the command line
  ledState = false;

// open the serial port. The portname comes from the command line /dev/cu.usbmodem1411
var myPort = new SerialPort("/dev/cu.usbmodem1451", { 
  baudRate: 115200,
  // add an option in the serial port object 
  // so that you can keep track of whether or not the serial port is open:
  options: false,
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n")
});
 
// called when the serial port opens:
myPort.on('open', function() {
  console.log('port open');
  // set options.open so you can track the port statue:
  myPort.options.open = true;
});

// called when the serial port closes:
myPort.on('close', function() {
  console.log('cerar');
  // set options.open so you can track the port statue:
  myPort.options.open = false;
});

// called when there's an error with the serial port:
myPort.on('error', function(error) {
  console.log('there was an error with the serial port: ' + error);
  myPort.close();
});

// called when there's new incoming serial data:  
myPort.on('data', function (data) {
  // for debugging, you should see this in Terminal:
  console.log('data: ', data);
});

if (myPort.options.open) {
  console.log('pintar');
  myPort.write("my string\n3");
  myPort.close();
}

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;