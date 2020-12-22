const SerialPort = require('serialport');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE = 0x00;
const DMXKING_ULTRA_DMX_PRO_START_OF_MSG = 0x7e;
const DMXKING_ULTRA_DMX_PRO_END_OF_MSG = 0xe7;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ = 0x06;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ = 0x64;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ = 0x65;
// var DMXKING_ULTRA_DMX_PRO_RECV_DMX_PKT = 0x05;

function DMXKingUltraDMXPro(deviceId, options = {}) {
  this.options = options;
  this.universe = Buffer.alloc(513, 0);
  this.readyToWrite = true;
  this.interval = 1000 / (options.dmx_speed || 40);

  this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ;
  if (this.options.port === 'A') {
    this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ;
  } else if (this.options.port === 'B') {
    this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ;
  }

  this.dev = new SerialPort(deviceId, {
    'baudRate': 250000,
    'dataBits': 8,
    'stopBits': 2,
    'parity': 'none',
  }, err => {
    if (!err) {
      this.start();
    } else {
      console.warn(err);
    }
  });
}

DMXKingUltraDMXPro.prototype.sendUniverse = function () {
  if (!this.dev.writable) {
    return;
  }

  if (this.readyToWrite) {
    this.readyToWrite = false;

    const hdr = Buffer.from([
      DMXKING_ULTRA_DMX_PRO_START_OF_MSG,
      this.sendDMXReq,
      (this.universe.length) & 0xff,
      ((this.universe.length) >> 8) & 0xff,
      DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE,
    ]);

    const msg = Buffer.concat([
      hdr,
      this.universe.slice(1),
      Buffer.from([DMXKING_ULTRA_DMX_PRO_END_OF_MSG]),
    ]);

    this.dev.write(msg);
    this.dev.drain(() => {
      this.readyToWrite = true;
    });
  }
};

DMXKingUltraDMXPro.prototype.start = function () {
  this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
};

DMXKingUltraDMXPro.prototype.stop = function () {
  clearInterval(this.intervalhandle);
};

DMXKingUltraDMXPro.prototype.close = function (cb) {
  this.dev.close(cb);
};

DMXKingUltraDMXPro.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.emit('update', u, extraData);
};

DMXKingUltraDMXPro.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
};

DMXKingUltraDMXPro.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(DMXKingUltraDMXPro, EventEmitter);

module.exports = DMXKingUltraDMXPro;
