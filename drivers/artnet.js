const dgram = require('dgram');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function ArtnetDriver(deviceId = '127.0.0.1', options = {}) {
  const self = this;

  self.header = Buffer.from([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
  self.sequence = Buffer.from([0]);
  self.physical = Buffer.from([0]);
  self.universeId = Buffer.from([0x00, 0x00]);
  self.length = Buffer.from([0x02, 0x00]);

  self.universe = Buffer.alloc(513);
  self.universe.fill(0);

  /**
   * Allow artnet rate to be set and default to 44Hz
   * @type Number
   */
  self.sleepTime = !isNaN(options.dmx_speed) ? 1000 / options.dmx_speed : 24;

  self.universeId.writeInt16LE(options.universe || 0, 0);
  self.host = deviceId;
  self.port = options.port || 6454;
  self.dev = dgram.createSocket('udp4');
  self.dev.bind(() => self.dev.setBroadcast(true));
  self.start();
}

ArtnetDriver.prototype.sendUniverse = function (_) {
  const pkg = Buffer.concat([
    this.header,
    this.sequence,
    this.physical,
    this.universeId,
    this.length,
    this.universe.slice(1),
  ]);

  this.dev.send(pkg, 0, pkg.length, this.port, this.host);
};

ArtnetDriver.prototype.start = function () {
  this.timeout = setInterval(this.sendUniverse.bind(this), this.sleepTime);
};

ArtnetDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

ArtnetDriver.prototype.close = function (cb) {
  this.stop();
  cb(null);
};

ArtnetDriver.prototype.update = function (u, _) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u);
};

ArtnetDriver.prototype.updateAll = function (v, _) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

ArtnetDriver.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(ArtnetDriver, EventEmitter);

module.exports = ArtnetDriver;
