const dgram = require('dgram');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const UNIVERSE_LEN = 512;

function BBDMX(deviceId = '127.0.0.1', options = {}) {
  this.readyToWrite = true;
  this.interval = options.dmx_speed ? (1000 / options.dmx_speed) : 24;
  this.options = options;
  this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
  this.host = deviceId;
  this.port = options.port || 9930;
  this.dev = dgram.createSocket('udp4');
  this.start();
}

BBDMX.prototype.sendUniverse = function () {
  if (this.readyToWrite) {
    this.readyToWrite = false;

    let channel;
    let messageBuffer = Buffer.from(UNIVERSE_LEN.toString());

    for (const i = 1; i <= UNIVERSE_LEN; i++) {
      channel = Buffer.from(' ' + this.universe[i]);
      messageBuffer = Buffer.concat([messageBuffer, channel]);
    }

    this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host, () => {
      this.readyToWrite = true;
    });
  }
};

BBDMX.prototype.start = function () {
  this.interval = setInterval(this.sendUniverse.bind(this), this.interval);
};

BBDMX.prototype.stop = function () {
  clearInterval(this.interval);
};

BBDMX.prototype.close = function (cb) {
  this.stop();
  cb(null);
};

BBDMX.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u, extraData);
};

BBDMX.prototype.updateAll = function (v) {
  for (const i = 1; i <= UNIVERSE_LEN; i++) {
    this.universe[i] = v;
  }
};

BBDMX.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(BBDMX, EventEmitter);

module.exports = BBDMX;
