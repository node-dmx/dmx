const SerialPort = require("serialport");

const DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE = 0x00;
const DMXKING_ULTRA_DMX_PRO_START_OF_MSG = 0x7e;
const DMXKING_ULTRA_DMX_PRO_END_OF_MSG = 0xe7;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ = 0x06;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ = 0x64;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ = 0x65;
// var DMXKING_ULTRA_DMX_PRO_RECV_DMX_PKT = 0x05;

function DMXKingUltraDMXPro(deviceId, options = {}) {
  const self = this;

  this.options = options;
  this.universe = Buffer.alloc(513, 0);

  this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ;
  if (this.options.port === "A") {
    this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ;
  } else if (this.options.port === "B") {
    this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ;
  }

  this.dev = new SerialPort(
    deviceId,
    {
      baudRate: 250000,
      dataBits: 8,
      stopBits: 2,
      parity: "none"
    },
    err => {
      if (!err) {
        self.sendUniverse();
      }
    }
  );
}

DMXKingUltraDMXPro.prototype.sendUniverse = function() {
  if (!this.dev.writable) {
    return;
  }
  const hdr = Buffer.from([
    DMXKING_ULTRA_DMX_PRO_START_OF_MSG,
    this.sendDMXReq,
    this.universe.length & 0xff,
    (this.universe.length >> 8) & 0xff,
    DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE
  ]);

  const msg = Buffer.concat([
    hdr,
    this.universe.slice(1),
    Buffer.from([DMXKING_ULTRA_DMX_PRO_END_OF_MSG])
  ]);

  this.dev.write(msg);
};

DMXKingUltraDMXPro.prototype.start = () => {};
DMXKingUltraDMXPro.prototype.stop = () => {};

DMXKingUltraDMXPro.prototype.close = function(cb) {
  this.dev.close(cb);
};

DMXKingUltraDMXPro.prototype.update = function(u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.sendUniverse();
};

DMXKingUltraDMXPro.prototype.updateAll = function(v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }
  this.sendUniverse();
};

DMXKingUltraDMXPro.prototype.get = function(c) {
  return this.universe[c];
};

module.exports = DMXKingUltraDMXPro;
