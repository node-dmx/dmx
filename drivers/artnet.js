const dgram = require('dgram');

function ArtnetDriver(deviceId = '127.0.0.1', options = {}) {
  const self = this;

  self.header = new Buffer([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
  self.sequence = new Buffer([0]);
  self.physical = new Buffer([0]);
  self.universeId = new Buffer([0x00, 0x00]);
  self.length = new Buffer([0x02, 0x00]);

  self.universe = new Buffer(513);
  self.universe.fill(0);

  self.sleepTime = !isNaN(options.dmx_speed) ? option.rate * 1000 : 24;

  self.universe_id.writeInt16LE(options.universe || 0, 0);
  self.host = deviceId;
  self.port = options.port || 6454;
  self.dev = dgram.createSocket('udp4');
  self.dev.bind(() => self.dev.setBroadcast(true));
  self.start();
}

ArtnetDriver.prototype.sendUniverse = function () {
  const pkg = Buffer.concat([
    this.header,
    this.sequence,
    this.physical,
    this.universe_id,
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

ArtnetDriver.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
};

ArtnetDriver.prototype.updateAll = function (v) {
  for (const i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

ArtnetDriver.prototype.get = function (c) {
  return this.universe[c];
};

module.exports = ArtnetDriver;
