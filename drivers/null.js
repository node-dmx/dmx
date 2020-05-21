const util = require('util');
const EventEmitter = require('events').EventEmitter;

function NullDriver(deviceId, options = {}) {
  this.universe = Buffer.alloc(513, 0);
  this.interval = 1000 / (options.dmx_speed || 1);
  this.start();
}

NullDriver.prototype.start = function () {
  this.timeout = setInterval(() => {
    this.logUniverse();
  }, this.interval);
};

NullDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

NullDriver.prototype.close = cb => {
  cb(null);
};

NullDriver.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.logUniverse();

  this.emit('update', u, extraData);
};

NullDriver.prototype.updateAll = function (v, _) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

NullDriver.prototype.get = function (c) {
  return this.universe[c];
};

NullDriver.prototype.logUniverse = function () {
  console.log(this.universe.slice(1));
};

util.inherits(NullDriver, EventEmitter);

module.exports = NullDriver;
