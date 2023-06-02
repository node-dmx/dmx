import SerialDriver from './SerialDriver.js';

const DMX_KING_ULTRA_DMX_PRO_DMX_START_CODE = 0x00;
const DMX_KING_ULTRA_DMX_PRO_START_OF_MSG = 0x7e;
const DMX_KING_ULTRA_DMX_PRO_END_OF_MSG = 0xe7;
const DMX_KING_ULTRA_DMX_PRO_SEND_DMX_RQ = 0x06;
const DMX_KING_ULTRA_DMX_PRO_SEND_DMX_A_RQ = 0x64;
const DMX_KING_ULTRA_DMX_PRO_SEND_DMX_B_RQ = 0x65;

export default class DMXKingUltraDMXProDriver extends SerialDriver {
  constructor(options = {}) {
    super(options);

    switch (options.port) {
      case 'A':
        this.sendDMXReq = DMX_KING_ULTRA_DMX_PRO_SEND_DMX_A_RQ;
        break;
      case 'B':
        this.sendDMXReq = DMX_KING_ULTRA_DMX_PRO_SEND_DMX_B_RQ;
        break;
      default:
        this.sendDMXReq = DMX_KING_ULTRA_DMX_PRO_SEND_DMX_RQ;
    }
  }

  send() {
    if (!this.serial.writable || !this.ready) {
      return;
    }

    this.ready = false;

    const header = Buffer.from([
      DMX_KING_ULTRA_DMX_PRO_START_OF_MSG,
      this.sendDMXReq,
      (this.universe.length) & 0xff,
      ((this.universe.length) >> 8) & 0xff,
      DMX_KING_ULTRA_DMX_PRO_DMX_START_CODE,
    ]);

    const chunk = Buffer.concat([
      header,
      this.universe.subarray(1),
      Buffer.from([DMX_KING_ULTRA_DMX_PRO_END_OF_MSG]),
    ]);

    this.serial.write(chunk);
    this.serial.drain(() => {
      this.ready = true;
    });
  }
}
