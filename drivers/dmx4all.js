const SerialPort = require('serialport');

const UNIVERSE_LEN = 512;

function DMX4ALL(deviceId, options = {}) {
  const self = this;

  this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
  this.universe.fill(0);

  this.dev = new SerialPort(deviceId, {
    'baudRate': 38400,
    'dataBits': 8,
    'stopBits': 1,
    'parity': 'none',
  }, err => {
    if (!err) {
      self.sendUniverse();
    }
  });
  this.dev.on('data', data => {
    // process.stdout.write(data.toString('ascii'))
  });
}

DMX4ALL.prototype.sendUniverse = function () {
  if (!this.dev.writable) {
    return;
  }

  const msg = Buffer.alloc(UNIVERSE_LEN * 3);

  for (let i = 0; i < UNIVERSE_LEN; i++) {
    msg[i * 3 + 0] = (i < 256) ? 0xE2 : 0xE3;
    msg[i * 3 + 1] = i;
    msg[i * 3 + 2] = this.universe[i + 1];
  }
  this.dev.write(msg);
};

DMX4ALL.prototype.start = () => {};
DMX4ALL.prototype.stop = () => {};

DMX4ALL.prototype.close = function (cb) {
  this.dev.close(cb);
};

DMX4ALL.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.sendUniverse();
};

DMX4ALL.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
  this.sendUniverse();
};

DMX4ALL.prototype.get = function (c) {
  return this.universe[c];
};

module.exports = DMX4ALL;
