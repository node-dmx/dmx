const SerialPort = require('serialport');

const ENTTEC_PRO_DMX_STARTCODE = 0x00;
const ENTTEC_PRO_START_OF_MSG = 0x7e;
const ENTTEC_PRO_END_OF_MSG = 0xe7;
const ENTTEC_PRO_SEND_DMX_RQ = 0x06;
// var ENTTEC_PRO_RECV_DMX_PKT = 0x05;

function EnttecUSBDMXPRO(deviceId, options = {}) {
  const self = this;

  this.universe = Buffer.alloc(513, 0);

  this.dev = new SerialPort(deviceId, {
    'baudRate': 250000,
    'dataBits': 8,
    'stopBits': 2,
    'parity': 'none',
  }, err => {
    if (!err) {
      self.sendUniverse();
    }
  });
}

EnttecUSBDMXPRO.prototype.sendUniverse = function () {
  if (!this.dev.writable) {
    return;
  }
  const hdr = Buffer.from([
    ENTTEC_PRO_START_OF_MSG,
    ENTTEC_PRO_SEND_DMX_RQ,
    (this.universe.length) & 0xff,
    ((this.universe.length) >> 8) & 0xff,
    ENTTEC_PRO_DMX_STARTCODE,
  ]);

  const msg = Buffer.concat([
    hdr,
    this.universe.slice(1),
    Buffer.from([ENTTEC_PRO_END_OF_MSG]),
  ]);

  this.dev.write(msg);
};

EnttecUSBDMXPRO.prototype.start = () => { };
EnttecUSBDMXPRO.prototype.stop = () => { };

EnttecUSBDMXPRO.prototype.close = function (cb) {
  this.dev.close(cb);
};

EnttecUSBDMXPRO.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.sendUniverse();
};

EnttecUSBDMXPRO.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
  this.sendUniverse();
};

EnttecUSBDMXPRO.prototype.get = function (c) {
  return this.universe[c];
};

module.exports = EnttecUSBDMXPRO;
