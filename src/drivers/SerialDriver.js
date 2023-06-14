import { SerialPort } from 'serialport';
import Driver, { EVENT_STOP } from './Driver.js'

export const BAUD_RATE = 250000;
export const DATA_BITS = 8;
export const STOP_BITS = 2;

export const EVENT_CLOSE = 'close';

export default class SerialDriver extends Driver {
  constructor(options = {}) {
    super(options);

    this.ready = true;

    this.on(EVENT_STOP, this.close);

    this.serial = new SerialPort({
      path: options.path,
      baudRate: options.baudRate || BAUD_RATE,
      dataBits: options.dataBits || DATA_BITS,
      stopBits: options.stopBits || STOP_BITS,
      parity: 'none',
    }, this.init.bind(this));
  }

  close() {
    this.serial.close((error) => {
      this.emit(EVENT_CLOSE, error);
    });
  }
}
