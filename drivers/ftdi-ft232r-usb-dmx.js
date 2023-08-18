const { SerialPort } = require('serialport');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function FTDIFT232RUsbDMX(deviceId, options = {}) {
  this.universe = Buffer.alloc(513);
  this.readyToWrite = true;
  this.interval = options.dmx_speed ? (1000 / options.dmx_speed) : 46;
  this.deviceId = deviceId;

  this.dev = new SerialPort({
    path: deviceId,
    'baudRate': 250000,
    'dataBits': 8,
    'stopBits': 2,
    'parity': 'none',
  }, err => {
    if (!err) {
      this.start();
    }
  }).on('error', function (err) {
    console.warn(err);
  });
}

FTDIFT232RUsbDMX.prototype.sendUniverse = function () {
  const self = this;

  if (!this.dev.writable) {
    return;
  }

  // toggle break
  self.dev.set({ brk: true, rts: true }, (err, r) => {
    setTimeout(() => {
      self.dev.set({ brk: false, rts: true }, (err, r) => {
        setTimeout(() => {
          if (self.readyToWrite) {
            self.readyToWrite = false;
            self.dev.write(Buffer.concat([Buffer.from([0]), self.universe.slice(1)]));
            self.dev.drain(() => {
              self.readyToWrite = true;
            });
          }
        }, 1);
      });
    }, 1);
  });
};

FTDIFT232RUsbDMX.prototype.start = function () {
  this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
};

FTDIFT232RUsbDMX.prototype.stop = function () {
  clearInterval(this.intervalhandle);
};

FTDIFT232RUsbDMX.prototype.close = function (cb) {
  this.stop();
  this.dev.close(cb);
};

FTDIFT232RUsbDMX.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u, extraData);
};

FTDIFT232RUsbDMX.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

FTDIFT232RUsbDMX.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(FTDIFT232RUsbDMX, EventEmitter);

module.exports = FTDIFT232RUsbDMX;
