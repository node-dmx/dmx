import {AbstractUniverseDriver} from './abstract-universe-driver';
import {UniverseDriver} from './universe-driver';

const EventEmitter = require('events').EventEmitter;

export interface NullDriverArgs {
  dmx_speed?: number;
}

export class NullDriver extends AbstractUniverseDriver implements UniverseDriver {
  constructor(deviceId: any, options: NullDriverArgs) {
    super();

    this._universe = Buffer.alloc(513, 0);
    this._interval = 1000 / (options?.dmx_speed ?? 1);
    this.start();
  }

  start(): void {
    this._timeout = setInterval(() => {
      this.logUniverse();
    }, this._interval);
  }

  stop(): void {
    clearInterval(this._timeout);
  }

  close(cb: Function): void {
    cb(null);
  }

  update(u: number[], extraData: any): void {
    for (const c in u) {
      this._universe[c] = u[c];
    }
    this.logUniverse();

    this._events.emit('update', u, extraData);
  }

  updateAll(v: number): void {
    for (let i = 1; i <= 512; i++) {
      this._universe[i] = v;
    }
  }

  get(c: number): number {
    return this._universe[c];
  }

  logUniverse(): void {
    console.log(this._universe.slice(1));
  }

  private readonly _universe: Buffer;
  private readonly _interval: number;
  private _timeout: any;
}
