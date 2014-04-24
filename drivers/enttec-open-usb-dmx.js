"use strict"

var FTDI = require('ftdi')

function EnttecOpenUsbDMX(locationId, cb) {
  var self = this;

  cb = cb || function() {}
  self.universe = Array(513);
  self.universe[0] = 0;
  self.updateAll(0);
  self.sleepTime = 24; 
  self.timeout;
  self.dev = new FTDI.FtdiDevice(locationId)
  self.dev.open({
    'baudrate': 115200 / 2,
    'databits': 8,
    'stopbits': 2,
    'parity': 'none'
  }, function(err) {
    cb(err, locationId)
    if(!err) {
      self.loopUniverse()
    }
  })
}

EnttecOpenUsbDMX.prototype.loopUniverse = function(){
  var self = this;
  clearTimeout(self.timeout);

  self.dev.write(self.universe);

  self.timeout = setTimeout(function(){
    self.loopUniverse();
  }, self.sleepTime)
}

EnttecOpenUsbDMX.prototype.pause = function(){
  var self = this;

  clearTimeout(self.timeout);
}

EnttecOpenUsbDMX.prototype.close = function(cb){
  var self = this;

  self.pause();
  self.dev.close(function(err){
    cb(err)
  })
}

EnttecOpenUsbDMX.prototype.update = function(u) {
  var self = this;

  for(var c in u) {
    self.universe[(c + 1)] = u[c];
  }
}

EnttecOpenUsbDMX.prototype.updateAll = function(v) {
  var self = this;

  var i = 1;
  while(i < self.universe.length){
    self.universe[i] = v;
    i++;
  }
}

EnttecOpenUsbDMX.prototype.get = function(c) {
  var self = this;

  return self.universe[(c + 1)];
}

module.exports = EnttecOpenUsbDMX
