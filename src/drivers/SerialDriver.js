import { SerialPort } from 'serialport';
import Driver from '../Driver.js';

export const BAUD_RATE = 250000;
export const DATA_BITS = 8;
export const STOP_BITS = 2;

export default class SerialDriver extends Driver {
  constructor(options = {}) {
    super(options);

    this.ready = true;

    this.serial = new SerialPort({
      path: options.path,
      baudRate: options.baudRate || BAUD_RATE,
      dataBits: options.dataBits || DATA_BITS,
      stopBits: options.stopBits || STOP_BITS,
      parity: 'none',
    }, this.init.bind(this));
  }

  close() {
    return new Promise(resolve => {
      this.stop();
      this.serial.close(resolve);
    });
  }
}
