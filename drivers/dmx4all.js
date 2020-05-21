const SerialPort = require('serialport');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const UNIVERSE_LEN = 512;

function DMX4ALL(deviceId, options = {}) {
  this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
  this.readyToWrite = true;
  this.interval = 1000 / (options.dmx_speed || 33);

  this.dev = new SerialPort(deviceId, {
    'baudRate': 38400,
    'dataBits': 8,
    'stopBits': 1,
    'parity': 'none',
  }, err => {
    if (!err) {
      this.start();
    } else {
      console.warn(err);
    }
  });
  // this.dev.on('data', data => {
  //   process.stdout.write(data.toString('ascii'))
  // });
}

DMX4ALL.prototype.sendUniverse = function () {
  if (!this.dev.writable) {
    return;
  }

  if (this.readyToWrite) {
    this.readyToWrite = false;

    const msg = Buffer.alloc(UNIVERSE_LEN * 3);

    for (let i = 0; i < UNIVERSE_LEN; i++) {
      msg[i * 3 + 0] = (i < 256) ? 0xE2 : 0xE3;
      msg[i * 3 + 1] = i;
      msg[i * 3 + 2] = this.universe[i + 1];
    }

    this.dev.write(msg);
    this.dev.drain(() => {
      this.readyToWrite = true;
    });
  }
};

DMX4ALL.prototype.start = function () {
  this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
};

DMX4ALL.prototype.stop = function () {
  clearInterval(this.intervalhandle);
};

DMX4ALL.prototype.close = function (cb) {
  this.dev.close(cb);
};

DMX4ALL.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u, extraData);
};

DMX4ALL.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

DMX4ALL.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(DMX4ALL, EventEmitter);

module.exports = DMX4ALL;
