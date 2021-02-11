import SerialPort from 'serialport';
import {EventEmitter} from 'events';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';

const UNIVERSE_LEN = 512;

export interface DMX4AllArgs {
  dmxSpeed?: number;
}

export class DMX4AllDriver extends EventEmitter implements IUniverseDriver {
  private readonly universe: Buffer;
  private readyToWrite: boolean;
  private readonly interval: number;
  private readonly dev: SerialPort;
  private intervalhandle?: any;
  constructor(deviceId: string, options: DMX4AllArgs = {}) {
    super();
    this.universe = Buffer.alloc(UNIVERSE_LEN + 1);
    this.readyToWrite = true;
    this.interval = 1000 / (options.dmx_speed || 33);

    this.dev = new SerialPort(deviceId, {
      'baudRate': 38400,
      'dataBits': 8,
      'stopBits': 1,
      'parity': 'none',
    }, (err: any) => {
      if (!err) {
        this.start();
      } else {
        console.warn(err);
      }
    });
    // this.dev.on('data', data => {
    //   process.stdout.write(data.toString('ascii'))
    // });
  }

  sendUniverse(): void {
    if (!this.dev.writable) {
      return;
    }

    if (this.readyToWrite) {
      this.readyToWrite = false;

      const msg = Buffer.alloc(UNIVERSE_LEN * 3);

      for (let i = 0; i < UNIVERSE_LEN; i++) {
        msg[i * 3 + 0] = (i < 256) ? 0xE2 : 0xE3;
        msg[i * 3 + 1] = i;
        msg[i * 3 + 2] = this.universe[i + 1];
      }

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
