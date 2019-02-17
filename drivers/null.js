const util = require('util');
const EventEmitter = require('events').EventEmitter;

function NullDriver(deviceId, options) {
  const self = this;

  options = options || {};
  this.universe = Buffer.alloc(513, 0);
  self.start();
}

NullDriver.prototype.start = function () {
  const self = this;

  self.timeout = setInterval(() => {
    console.log(self.universe);
  }, 1000);
};

NullDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

NullDriver.prototype.close = cb => {
  cb(null);
};

NullDriver.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  console.log(this.universe.slice(1));

  this.emit('update', u);
};

NullDriver.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

NullDriver.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(NullDriver, EventEmitter);

module.exports = NullDriver;
