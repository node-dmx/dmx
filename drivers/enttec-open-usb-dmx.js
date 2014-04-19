"use strict"

var FTDI = require('ftdi')

function EnttecOpenUsbDMX(device_id, cb) {
  var self = this;

  cb = cb || function() {}
  self.universe = new Buffer(513);
  self.universe.fill(0);
  self.sleepTime = 20; 
  self.timeout;
  
  self.dev = new FTDI.FtdiDevice(device_id)
  self.dev.open({
    'baudrate': 115200 / 2,
    'databits': 8,
    'stopbits': 2,
    'parity': 'none'
  }, function(err) {
    cb(err, device_id)
    if(!err) {
      self.loopUniverse()
    }
  })
}

EnttecOpenUsbDMX.prototype.loopUniverse = function(){
  var self = this;

  self.dev.write(self.universe);
  self.timeout = setTimeout(function(){
    self.loopUniverse();
  }, self.sleepTime)
}

EnttecOpenUsbDMX.prototype.pause = function(){
  clearTimeout(self.timeout);
}

EnttecOpenUsbDMX.prototype.close = function(cb){
  self.dev.close(function(err){
    cb(err)
  })
}

EnttecOpenUsbDMX.prototype.update = function(u) {
  var self = this;

  for(var c in u) {
    self.universe[(c + 1)] = u[self.toHex(c)];
  }
}

EnttecOpenUsbDMX.prototype.get = function(c) {
  var self = this;

  return self.universe[(c + 1)];
}

EnttecOpenUsbDMX.prototype.toHex = function(number){
  var self = this;

  var octet =  parseInt(number).toString(16);
  if(octet.length == 1){ octet = "0" + octet; }
  var fullOctet = "0x" + octet;
  return eval(fullOctet); // TODO: dangerous! 
}

module.exports = EnttecOpenUsbDMX
