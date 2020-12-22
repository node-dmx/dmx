import Timeout = NodeJS.Timeout;
import {AbstractUniverseDriver} from './abstract-universe-driver';
import {UniverseDriver} from './universe-driver';

const SerialPort = require('serialport');

export interface EnttecOpenUsbDmxArgs {
  dmx_speed?: number;
}

export class EnttecOpenUsbDMX extends AbstractUniverseDriver implements UniverseDriver {
  constructor(deviceId: string, args: EnttecOpenUsbDmxArgs) {
    super();

    this._universe = Buffer.alloc(513);
    this._readyToWrite = true;
    this._interval = args?.dmx_speed ? (1000 / args.dmx_speed) : 46;

    this._dev = new SerialPort(deviceId, {
      'baudRate': 250000,
      'dataBits': 8,
      'stopBits': 2,
      'parity': 'none',
    }, (err: any) => {
      if (!err) {
        this.start();
      } else {
        console.warn(err);
      }
    });
  }

  update(channels: {[key:number]: number}, extraData: any): void {
    for (const c in channels) {
      this._universe[c] = channels[c];
    }

    this.emitUpdate(channels, extraData);
  }

  updateAll(value: any): void {
    for (let i = 1; i <= 512; i++) {
      this._universe[i] = value;
    }
  }

  sendUniverse(): void {
    const self = this;

    if (!this._dev.writable) {
      return;
    }

    // toggle break
    self._dev.set({brk: true, rts: true}, (err:any, r:any) => {
      setTimeout(() => {
        self._dev.set({brk: false, rts: true}, (err:any, r:any) => {
          setTimeout(() => {
            if (self._readyToWrite) {
              self._readyToWrite = false;
              self._dev.write(Buffer.concat([Buffer.from([0]), self._universe.slice(1)]));
              self._dev.drain(() => {
                self._readyToWrite = true;
              });
            }
          }, 1);
        });
      }, 1);
    });
  }

  start(): void {
    this._intervalHandle = setInterval(this.sendUniverse.bind(this), this._interval);
  }

  stop(): void {
    this._intervalHandle && clearInterval(this._intervalHandle);
  }

  close(cb: Function): void {
    this.stop();
    this._dev.close(cb);
  }

  get(c: number): number {
    return this._universe[c];
  }

  private readonly _universe: Buffer;
  private readonly _interval: number;
  private readonly _dev: any;

  private _readyToWrite: boolean;
  private _intervalHandle: Timeout | undefined;
}
