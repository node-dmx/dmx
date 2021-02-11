import SerialPort from 'serialport';
import { EventEmitter } from 'events';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';

const ENTTEC_PRO_DMX_STARTCODE = 0x00;
const ENTTEC_PRO_START_OF_MSG = 0x7e;
const ENTTEC_PRO_END_OF_MSG = 0xe7;
const ENTTEC_PRO_SEND_DMX_RQ = 0x06;
// var ENTTEC_PRO_RECV_DMX_PKT = 0x05;

export interface EnttecUSBDMXProArgs {
  dmx_speed?: number;
}

export class EnttecUSBDMXProDriver extends EventEmitter implements IUniverseDriver {
  universe: Buffer;
  readyToWrite: boolean;
  interval: number;
  dev: SerialPort;
  intervalhandle?: NodeJS.Timeout;
  constructor(deviceId: string, options: EnttecUSBDMXProArgs = {}) {
    super();
    this.universe = Buffer.alloc(513, 0);
    this.readyToWrite = true;
    this.interval = 1000 / (options.dmx_speed || 40);

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

  sendUniverse(): void {
    if (!this.dev.writable) {
      return;
    }

    if (this.readyToWrite) {
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

      this.readyToWrite = false;
      this.dev.write(msg);
      this.dev.drain(() => {
        this.readyToWrite = true;
      });
    }
  }


  start(): void {
    this.intervalhandle = setInterval(this.sendUniverse.bind(this), this.interval);
  }

  stop(): void {
    if (this.intervalhandle) clearInterval(this.intervalhandle);
  }

  close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dev.close((e) => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
  }

  update(u: UniverseData, extraData?: any): void {
    for (const c in u) {
      this.universe[c] = u[c];
    }

    this.emit('update', u, extraData);
  }

  updateAll(v: number): void {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }
  }

  get(c: number): number {
    return this.universe[c];
  }
}
