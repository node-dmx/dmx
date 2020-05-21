const dgram = require('dgram');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function ArtnetDriver(deviceId = '127.0.0.1', options = {}) {
  this.readyToWrite = true;
  this.header = Buffer.from([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
  this.sequence = Buffer.from([0]);
  this.physical = Buffer.from([0]);
  this.universeId = Buffer.from([0x00, 0x00]);
  this.length = Buffer.from([0x02, 0x00]);

  this.universe = Buffer.alloc(513);
  this.universe.fill(0);

  /**
   * Allow artnet rate to be set and default to 44Hz
   * @type Number
   */
  this.interval = !isNaN(options.dmx_speed) ? 1000 / options.dmx_speed : 24;

  this.universeId.writeInt16LE(options.universe || 0, 0);
  this.host = deviceId;
  this.port = options.port || 6454;
  this.dev = dgram.createSocket('udp4');
  this.dev.bind(() => this.dev.setBroadcast(true));
  this.start();
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

  if (this.readyToWrite) {
    this.readyToWrite = false;
    this.dev.send(pkg, 0, pkg.length, this.port, this.host, () => {
      this.readyToWrite = true;
    });
  }
};

ArtnetDriver.prototype.start = function () {
  this.timeout = setInterval(this.sendUniverse.bind(this), this.interval);
};

ArtnetDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

ArtnetDriver.prototype.close = function (cb) {
  this.stop();
  cb(null);
};

ArtnetDriver.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u, extraData);
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
