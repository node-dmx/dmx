import SerialPort from 'serialport';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';
import { EventEmitter } from 'events';

const DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE = 0x00;
const DMXKING_ULTRA_DMX_PRO_START_OF_MSG = 0x7e;
const DMXKING_ULTRA_DMX_PRO_END_OF_MSG = 0xe7;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ = 0x06;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ = 0x64;
const DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ = 0x65;
// var DMXKING_ULTRA_DMX_PRO_RECV_DMX_PKT = 0x05;

export interface DMXKingUltraDMXProDriverArgs {
  dmxSpeed?: number;
  port?: 'A' | 'B';
}

export class DMXKingUltraDMXProDriver extends EventEmitter implements IUniverseDriver {
  options: DMXKingUltraDMXProDriverArgs;
  universe: Buffer;
  readyToWrite: boolean;
  interval: number;
  sendDMXReq: number;
  dev: SerialPort;
  intervalhandle?: any;
  constructor(deviceId: string, options: DMXKingUltraDMXProDriverArgs = {}) {
    super();
    this.options = options;
    this.universe = Buffer.alloc(513, 0);
    this.readyToWrite = true;
    this.interval = 1000 / (options.dmxSpeed || 40);

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
    }, (err) => {
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

  updateAll(v: number): any {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }
  }

  get(c: number): number {
    return this.universe[c];
  }
}
