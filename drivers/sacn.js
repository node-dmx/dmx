const EventEmitter = require('events').EventEmitter;
const util = require('util');
const sacn = require('sacn');

function SACNDriver(deviceId, options = {}) {
  this.sACNServer = new sacn.Sender({
    universe: options.universe || 1,
    reuseAddr: true,
  });
  this.universe = {};
}

SACNDriver.prototype.start = function () {};

SACNDriver.prototype.stop = function () {
  this.sACNServer.close();
};

SACNDriver.prototype.close = function (cb) {
  this.stop();
  cb(null);
};

SACNDriver.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = this.dmxToPercent(u[c]);
  }
  this.sendUniverse();
};

SACNDriver.prototype.sendUniverse = function () {
  this.sACNServer.send({
    payload: this.universe,
  });
};

SACNDriver.prototype.updateAll = function (v, _) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = this.dmxToPercent(v);
  }
  this.sendUniverse();
};

SACNDriver.prototype.get = function (c) {
  return this.percentToDmx(this.universe[c]);
};

SACNDriver.prototype.dmxToPercent = function (v) {
  return v / 255 * 100;
};

SACNDriver.prototype.percentToDmx = function (v) {
  return v / 100 * 255;
};

util.inherits(SACNDriver, EventEmitter);

module.exports = SACNDriver;
