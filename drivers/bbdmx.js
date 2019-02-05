const dgram = require("dgram");

const UNIVERSE_LEN = 512;

function BBDMX(deviceId = "127.0.0.1", options = {}) {
  const self = this;

  self.options = options;
  self.universe = Buffer.alloc(UNIVERSE_LEN + 1);
  self.host = deviceId;
  self.port = self.options.port || 9930;
  self.dev = dgram.createSocket("udp4");
  self.sleepTime = 24;
  self.start();
}

BBDMX.prototype.sendUniverse = function() {
  let channel;
  let messageBuffer = Buffer.from(UNIVERSE_LEN.toString());

  for (const i = 1; i <= UNIVERSE_LEN; i++) {
    channel = Buffer.from(" " + this.universe[i]);
    messageBuffer = Buffer.concat([messageBuffer, channel]);
  }
  this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host);
};

BBDMX.prototype.start = function() {
  this.timeout = setInterval(this.sendUniverse.bind(this), this.sleepTime);
};

BBDMX.prototype.stop = function() {
  clearInterval(this.timeout);
};

BBDMX.prototype.close = function(cb) {
  this.stop();
  cb(null);
};

BBDMX.prototype.update = function(u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
};

BBDMX.prototype.updateAll = function(v) {
  for (const i = 1; i <= UNIVERSE_LEN; i++) {
    this.universe[i] = v;
  }
};

BBDMX.prototype.get = function(c) {
  return this.universe[c];
};

module.exports = BBDMX;
