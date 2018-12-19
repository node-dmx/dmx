const SerialPort = require('serialport');

function EnttecOpenUsbDMX(deviceId, options) {
  const self = this;

  options = options || {};

  this.universe = new Buffer(513);
  this.universe.fill(0);

  self.interval = 46;

  this.dev = new SerialPort(deviceId, {
    'baudRate': 250000,
    'dataBits': 8,
    'stopBits': 2,
    'parity': 'none',
  }, err => {
    if (err) {
      console.log(err);
      return;
    }
    self.start();
  });
}

EnttecOpenUsbDMX.prototype.sendUniverse = function () {
  const self = this;

  if (!this.dev.writable) {
    return;
  }

  // toggle break
  self.dev.set({brk: true, rts: true}, (err, r) => {
    setTimeout(() => {
      self.dev.set({brk: false, rts: true}, (err, r) => {
        setTimeout(() => {
          self.dev.write(Buffer.concat([Buffer([0]), self.universe.slice(1)]));
        }, 1);
      });
    }, 1);
  });
};

EnttecOpenUsbDMX.prototype.start = function () {
  this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
};

EnttecOpenUsbDMX.prototype.stop = function () {
  clearInterval(this.intervalhandle);
};

EnttecOpenUsbDMX.prototype.close = function (cb) {
  this.stop();
  this.dev.close(cb);
};

EnttecOpenUsbDMX.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
};

EnttecOpenUsbDMX.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

EnttecOpenUsbDMX.prototype.get = function (c) {
  return this.universe[c];
};

module.exports = EnttecOpenUsbDMX;
